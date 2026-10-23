
import { useState } from "react";
import {
  createSoundsRound,
  type SoundQuestion,
  type SoundFamily,
  type SoundMode,
} from "./soundsGameService";
import "./SoundsGame.css";

type SoundsGameProps = {
  onBack: () => void;
};

export default function SoundsGame({ onBack }: SoundsGameProps) {
  // Configuración de la profesora
  const [family, setFamily] = useState<SoundFamily>("Vocales");
  const [mode, setMode] = useState<SoundMode>("has");
  const [letter, setLetter] = useState("A");

  // Estado de la partida
  const [questions, setQuestions] = useState<SoundQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const question = questions[questionIndex];
  const isCorrect = selected === question?.correctAnswer;

  const availableLetters =
    family === "Vocales"
      ? ["A", "E", "I", "O", "U"]
      : ["M", "S", "L", "P", "T", "N" , "R"];

  // Preparar las 10 preguntas con la misma configuración
  async function startGame() {
    setLoading(true);
    setError(null);

    try {
      const generatedQuestions = await createSoundsRound(
        10,
        family,
        letter,
        mode,
      );

      if (generatedQuestions.length !== 10) {
        throw new Error("No se han generado las 10 preguntas.");
      }

      setQuestions(generatedQuestions);
      setQuestionIndex(0);
      setSelected(null);
      setShowHint(false);
      setScore(0);
      setFinished(false);
      setStarted(true);
    } catch (err) {
      console.error("Error al generar preguntas:", err);

      setError(
        "No hemos podido preparar las 10 preguntas. Prueba con otra letra.",
      );
    } finally {
      setLoading(false);
    }
  }

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

  function returnToSettings() {
    setStarted(false);
    setFinished(false);
    setQuestions([]);
    setQuestionIndex(0);
    setSelected(null);
    setShowHint(false);
    setScore(0);
    setError(null);
  }

  async function restartGame() {
    await startGame();
  }

  return (
    <main className="game-page">
      <button
        className="button-back"
        onClick={started ? returnToSettings : onBack}
      >
        {started ? "← Cambiar configuración" : "← Volver al hub"}
      </button>

      <header className="game-heading">
        <span className="eyebrow">
          🔎 DETECTIVES DE SONIDOS
        </span>

        <h1>¡Encuentra el sonido!</h1>

        <p>
          {started
            ? `Descubre las palabras relacionadas con el sonido ${letter}.`
            : "La profesora elige el reto y tú te conviertes en detective."}
        </p>
      </header>

      {loading ? (
        <section className="game-panel" aria-live="polite">
          <div className="completion-emoji">🔎</div>
          <h2>Preparando la investigación...</h2>
          <p>Estamos preparando tus 10 preguntas.</p>
        </section>
      ) : !started ? (
        // PANTALLA DE CONFIGURACIÓN PARA LA PROFESORA
        <section className="game-panel">
          <h2>Prepara la investigación 🧑‍🏫</h2>

          <p>Elige qué sonido vais a practicar.</p>

          <label htmlFor="sound-family">
            <strong>1. Tipo de sonido</strong>
          </label>

          <select
            id="sound-family"
            value={family}
            onChange={(event) => {
              const newFamily = event.target.value as SoundFamily;

              setFamily(newFamily);
              setLetter(newFamily === "Vocales" ? "A" : "M");
              setError(null);
            }}
          >
            <option value="Vocales">Vocales</option>
            <option value="Consonantes">Consonantes</option>
          </select>

          <label htmlFor="sound-mode">
            <strong>2. ¿Qué debe encontrar?</strong>
          </label>

          <select
            id="sound-mode"
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as SoundMode)
            }
          >
            <option value="has">
              La palabra que SÍ tiene el sonido
            </option>
            <option value="missing">
              La palabra que NO tiene el sonido
            </option>
          </select>

          <p>
            <strong>3. Elige la letra</strong>
          </p>

          <div className="sound-letter-picker">
            {availableLetters.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  letter === item
                    ? "sound-letter-choice active"
                    : "sound-letter-choice"
                }
                onClick={() => {
                  setLetter(item);
                  setError(null);
                }}
                aria-pressed={letter === item}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="sound-config-summary">
            <span className="sound-letter-label">
              Tu investigación
            </span>

            <span className="sound-letter">
              {letter}
            </span>

            <p>
              {family} ·{" "}
              {mode === "has"
                ? "Encontrar una palabra que SÍ tenga el sonido"
                : "Encontrar una palabra que NO tenga el sonido"}
            </p>

            <p>🔟 10 preguntas · 4 imágenes por pregunta</p>
          </div>

          {error && (
            <p className="feedback-try" role="alert">
              {error}
            </p>
          )}

          <div className="game-actions">
            <button
              className="button-primary"
              onClick={startGame}
              disabled={loading}
            >
              ¡Empezar las 10 preguntas!
            </button>

            <button
              className="button-secondary"
              onClick={onBack}
            >
              Volver al hub
            </button>
          </div>
        </section>
      ) : error ? (
        <section className="game-panel" role="alert">
          <div className="completion-emoji">😕</div>
          <h2>¡Vaya, detective!</h2>
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
              onClick={returnToSettings}
            >
              Cambiar configuración
            </button>
          </div>
        </section>
      ) : finished ? (
        // RESULTADO FINAL
        <section className="game-panel completion-panel">
          <div className="completion-emoji">🏆</div>

          <h2>¡Caso resuelto!</h2>

          <p>
            Has acertado {score} de {questions.length} preguntas.
          </p>

          <p>
            Has practicado el sonido {letter} durante toda la investigación.
          </p>

          <div className="game-actions">
            <button
              className="button-primary"
              onClick={restartGame}
            >
              Repetir esta investigación
            </button>

            <button
              className="button-secondary"
              onClick={returnToSettings}
            >
              Elegir otro sonido
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
        // PANTALLA DE JUEGO
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
            {question.family} · Sonido {question.letter}
          </span>

          <div className="sound-letter-card">
            <span className="sound-letter-label">
              Busca este sonido
            </span>

            <span className="sound-letter">
              {question.letter}
            </span>
          </div>

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
                  key={`${option.word}-${option.emoji}`}
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

                  {/* <span>{option.word}</span> */}
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
                  ? "¡Muy bien, detective! 🎉"
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
            onClick={returnToSettings}
          >
            Volver a la configuración
          </button>
        </section>
      )}
    </main>
  );
}
