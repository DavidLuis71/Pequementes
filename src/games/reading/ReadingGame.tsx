
import { useState } from "react";
import "./ReadingGame.css";

import {
  generateStory,
  type Theme,
  type Difficulty,
  type StoryLength,
  type QuestionType,
  type GeneratedStory,
} from "./engine/storyGenerator";

import {
  generateQuestions,
  type ReadingQuestion,
} from "./engine/questionGenerator";

const themes: Theme[] = [
  "Aventura",
  "Misterio",
  "Animales",
  "Fantasía",
  "Ciencia",
  "Emociones",
  "Sorpresa",
];

const questionTypes: QuestionType[] = [
  "Comprensión literal",
  "Inferencias",
  "Causas y consecuencias",
  "Orden de acontecimientos",
  "Vocabulario",
  "Emociones e intenciones",
];

interface ReadingGameProps {
  onBack: () => void;
}

export default function ReadingGame({ onBack }: ReadingGameProps) {
  const [age, setAge] = useState(8);
  const [theme, setTheme] = useState<Theme>("Aventura");
  const [difficulty, setDifficulty] = useState<Difficulty>("Media");
  const [length, setLength] = useState<StoryLength>("Una cara A4");

  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    "Comprensión literal",
    "Inferencias",
    "Causas y consecuencias",
  ]);

  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [questions, setQuestions] = useState<ReadingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [previousStoryId, setPreviousStoryId] = useState<string>();

  const generateNewStory = () => {
    const nextStory = generateStory(
      { age, theme, difficulty, length },
      previousStoryId,
    );

    const nextQuestions = generateQuestions(nextStory, selectedTypes);

    setStory(nextStory);
    setQuestions(nextQuestions);
    setAnswers({});
    setSubmitted(false);
    setPreviousStoryId(nextStory.id);
  };

  const toggleQuestionType = (type: QuestionType) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  };

  const correctCount = questions.filter(
    (question) => answers[question.id] === question.correctAnswer,
  ).length;

  const allAnswered = questions.length > 0 &&
    questions.every((question) => Boolean(answers[question.id]));

  const allCorrect = questions.length > 0 && correctCount === questions.length;

  const retryIncorrect = () => {
    const incorrectIds = questions
      .filter((question) => answers[question.id] !== question.correctAnswer)
      .map((question) => question.id);

    setAnswers((current) => {
      const next = { ...current };
      incorrectIds.forEach((id) => delete next[id]);
      return next;
    });

    setSubmitted(false);
  };

  return (
    <main className="reading-game">
<header className="reading-header">
  <button
    type="button"
    className="back-button"
    onClick={onBack}
  >
    ← Volver
  </button>

  <span className="reading-header-icon" aria-hidden="true">
    📚
  </span>

  <div>
    <h1>Detectives de lectura</h1>
    <p>Lee, piensa y descubre todos los detalles.</p>
  </div>
</header>

      {!story && (
        <section className="teacher-panel">
          <h2>Preparar una historia</h2>
          <p className="panel-intro">
            Elige las características del cuento y prepara la actividad.
          </p>

          <div className="settings-grid">
            <label className="setting-field">
              <span>Edad</span>
              <select
                value={age}
                onChange={(event) => setAge(Number(event.target.value))}
              >
                {[6, 7, 8, 9, 10].map((value) => (
                  <option key={value} value={value}>
                    {value} años
                  </option>
                ))}
              </select>
            </label>

            <label className="setting-field">
              <span>Temática</span>
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as Theme)}
              >
                {themes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="setting-field">
              <span>Dificultad</span>
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty)
                }
              >
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </label>

            <label className="setting-field">
              <span>Longitud</span>
              <select
                value={length}
                onChange={(event) =>
                  setLength(event.target.value as StoryLength)
                }
              >
                <option value="Media cara A4">Media cara A4</option>
                <option value="Una cara A4">Una cara A4</option>
              </select>
            </label>
          </div>

          <fieldset className="question-type-fieldset">
            <legend>Tipos de preguntas</legend>
            <div className="question-type-grid">
              {questionTypes.map((type) => (
                <label key={type} className="check-option">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleQuestionType(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            <p className="field-help">
              Selecciona los tipos que quieras trabajar. Se prepararán cinco
              preguntas y, si faltan tipos disponibles, se completarán con
              otras preguntas del cuento.
            </p>
          </fieldset>

          <button
            className="primary-button"
            onClick={generateNewStory}
          >
            ✨ Generar cuento
          </button>
        </section>
      )}

      {story && (
        <>
          <section className="story-card">
            <div className="story-meta">
              <span>{story.theme}</span>
              <span>{story.age} años</span>
              <span>Dificultad {story.difficulty.toLowerCase()}</span>
            </div>

            <h2>{story.title}</h2>

            <div className="story-text">
              {story.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <button
              className="secondary-button"
              onClick={() => {
                setStory(null);
                setQuestions([]);
                setAnswers({});
                setSubmitted(false);
              }}
            >
              ⚙️ Cambiar configuración
            </button>
          </section>

          <section className="quiz-card">
            <div className="quiz-heading">
              <div>
                <h2>¡Comprueba lo que has entendido!</h2>
                <p>Lee cada pregunta con atención.</p>
              </div>
              <span className="question-counter">
                {Object.keys(answers).length}/{questions.length}
              </span>
            </div>

            {questions.map((question, index) => {
              const answer = answers[question.id];
              const isCorrect = answer === question.correctAnswer;

              return (
                <article className="question-card" key={question.id}>
                  <span className="question-type">{question.type}</span>
                  <h3>
                    {index + 1}. {question.prompt}
                  </h3>

                  <div className="answer-options">
                    {question.options.map((option) => {
                      const selected = answer === option;
                      const correctOption =
                        submitted && option === question.correctAnswer;
                      const wrongSelected =
                        submitted && selected && !isCorrect;

                      return (
                        <button
                          key={option}
                          type="button"
                          className={[
                            "answer-option",
                            selected ? "selected" : "",
                            correctOption ? "correct" : "",
                            wrongSelected ? "incorrect" : "",
                          ].filter(Boolean).join(" ")}
                          onClick={() => {
                            if (submitted) return;
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: option,
                            }));
                          }}
                          disabled={submitted}
                        >
                          <span className="answer-dot">
                            {selected ? "●" : "○"}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <p className={`answer-feedback ${isCorrect ? "good" : "try-again"}`}>
                      {isCorrect
                        ? "¡Muy bien! "
                        : `La respuesta correcta es: ${question.correctAnswer}. `}
                      {question.explanation}
                    </p>
                  )}
                </article>
              );
            })}

            {!submitted ? (
              <button
                className="primary-button"
                disabled={!allAnswered}
                onClick={() => setSubmitted(true)}
              >
                Comprobar respuestas
              </button>
            ) : (
              <div className="results-panel">
                <div className="results-emoji">
                  {allCorrect ? "🏆" : correctCount >= 3 ? "🌟" : "💪"}
                </div>
                <h3>
                  {allCorrect
                    ? "¡Reto superado!"
                    : `Has acertado ${correctCount} de ${questions.length}`}
                </h3>
                <p>
                  {allCorrect
                    ? "Has comprendido muy bien la historia."
                    : "Repasa las explicaciones e inténtalo de nuevo."}
                </p>

                {!allCorrect && (
                  <button
                    className="secondary-button"
                    onClick={retryIncorrect}
                  >
                    Intentar de nuevo las incorrectas
                  </button>
                )}

                {allCorrect && (
                  <button
                    className="primary-button"
                    onClick={generateNewStory}
                  >
                    📖 ¡Leer otro cuento!
                  </button>
                )}

                <button
                  className="text-button"
                  onClick={() => {
                    setStory(null);
                    setQuestions([]);
                    setAnswers({});
                    setSubmitted(false);
                  }}
                >
                  Volver a la configuración
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
