
import { useEffect, useState } from "react";
import {
  createRound,
  type GameQuestion,
} from "./emojiGameService";

type AlbumGameProps = {
  onBack: () => void;
};

export default function AlbumGame({ onBack }: AlbumGameProps) {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const question = questions[questionIndex];
  const isCorrect = selected === question?.correctAnswer;

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        setLoading(true);
        setError(null);

        const generatedQuestions = await createRound(10);

        if (!cancelled) {
          setQuestions(generatedQuestions);
          setQuestionIndex(0);
          setSelected(null);
          setShowHint(false);
          setScore(0);
          setFinished(false);
        }
      } catch (err) {
        console.error("Error al generar las preguntas:", err);

        if (!cancelled) {
          setError(
            "No hemos podido generar las preguntas. Comprueba tu conexión e inténtalo de nuevo."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  function chooseAnswer(option: string) {
    if (selected !== null || !question) return;

    setSelected(option);

    if (option === question.correctAnswer) {
      setScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    if (!question) return;

    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setShowHint(false);
  }

  async function restartGame() {
    setLoading(true);
    setError(null);
    setSelected(null);
    setShowHint(false);
    setScore(0);
    setQuestionIndex(0);
    setFinished(false);

    try {
      const generatedQuestions = await createRound(10);
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("Error al crear una nueva partida:", err);

      setError(
        "No hemos podido crear una nueva partida. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="game-page">
      <button className="button-back" onClick={onBack}>
        ← Volver al hub
      </button>

      <header className="game-heading">
        <span className="eyebrow">
          🖼️ ÁLBUM DE LAS PALABRAS
        </span>

        <h1>¡Encuentra la intrusa!</h1>

        <p>
          Observa las imágenes, encuentra la diferente
          y descubre por qué.
        </p>
      </header>

      {loading ? (
        <section className="game-panel" aria-live="polite">
          <div className="completion-emoji">🧩</div>
          <h2>Preparando tu álbum...</h2>
          <p>Estamos buscando palabras y creando nuevas preguntas.</p>
        </section>
      ) : error ? (
        <section className="game-panel" role="alert">
          <div className="completion-emoji">😕</div>
          <h2>No se ha podido cargar el juego</h2>
          <p>{error}</p>

          <div className="game-actions">
            <button
              className="button-primary"
              onClick={restartGame}
            >
              Reintentar
            </button>

            <button
              className="button-secondary"
              onClick={onBack}
            >
              Volver al hub
            </button>
          </div>
        </section>
      ) : finished ? (
        <section className="game-panel completion-panel">
          <div className="completion-emoji">🏆</div>

          <h2>¡Álbum completado!</h2>

          <p>
            Has acertado {score} de {questions.length} preguntas.
          </p>

          <p>
            ¡Cada palabra nueva es una oportunidad para aprender!
          </p>

          <div className="game-actions">
            <button
              className="button-primary"
              onClick={restartGame}
            >
              Nueva partida
            </button>

            <button
              className="button-secondary"
              onClick={onBack}
            >
              Volver al hub
            </button>
          </div>
        </section>
      ) : question ? (
        <section className="game-panel">
          <div className="progress-row">
            <span>
              Pregunta {questionIndex + 1} de {questions.length}
            </span>

            <span>⭐ Aciertos: {score}</span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progreso de la partida"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={questionIndex + 1}
          >
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((questionIndex + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>

          <span className="category-pill">
            {question.category}
          </span>

          <h2 className="question-title">
            {question.prompt}
          </h2>

          <div className="answer-grid">
            {question.options.map((option) => {
              const isSelected = selected === option.word;
              const isAnswer =
                option.word === question.correctAnswer;

              let stateClass = "";

              if (selected !== null && isAnswer) {
                stateClass = "answer-correct";
              } else if (isSelected && !isCorrect) {
                stateClass = "answer-incorrect";
              }

              return (
                <button
                  key={option.word}
                  className={`answer-option ${stateClass}`}
                  onClick={() => chooseAnswer(option.word)}
                  disabled={selected !== null}
                  aria-pressed={isSelected}
                >
                  <span
                    className="answer-emoji"
                    aria-hidden="true"
                  >
                    {option.emoji}
                  </span>

                  <span>{option.word}</span>
                </button>
              );
            })}
          </div>

          {selected === null ? (
            <div className="hint-area">
              {showHint && (
                <p className="hint-message" role="status">
                  💡 Pista: {question.hint}
                </p>
              )}

              <button
                className="button-secondary"
                onClick={() => setShowHint(true)}
                disabled={showHint}
              >
                💡{" "}
                {showHint
                  ? "Pista revelada"
                  : "Necesito una pista"}
              </button>
            </div>
          ) : (
            <div
              className={`feedback ${
                isCorrect ? "feedback-good" : "feedback-try"
              }`}
              role="status"
            >
              <h3>
                {isCorrect
                  ? "¡Muy bien! 🎉"
                  : "¡Buen intento! 💛"}
              </h3>

              <p>{question.explanation}</p>

              {!isCorrect && (
                <p>
                  La respuesta correcta era:{" "}
                  <strong>{question.correctAnswer}</strong>.
                </p>
              )}

              <button
                className="button-primary"
                onClick={nextQuestion}
              >
                {questionIndex === questions.length - 1
                  ? "Ver resultado"
                  : "Siguiente pregunta →"}
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="game-panel">
          <p>No hay preguntas disponibles.</p>

          <button
            className="button-primary"
            onClick={restartGame}
          >
            Generar preguntas
          </button>
        </section>
      )}
    </main>
  );
}