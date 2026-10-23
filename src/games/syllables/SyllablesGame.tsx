
import { useEffect, useState } from "react";
import {
  CONSONANTS,
  BLENDS,
  createSyllablesRound,
  getSyllableTypeLabel,
  type SyllableQuestion,
  type SyllableType,
} from "./syllablesGameService";
import "./SyllablesGame.css";

type Props = {
  onBack: () => void;
};

const TYPE_DESCRIPTIONS: Record<SyllableType, string> = {
  direct: "Consonante + vocal (MA, PE, LI)",
  inverse: "Vocal + consonante (AM, ES, IL)",
  blended: "Dos consonantes + vocal (PLA, BRE, TRI)",
};

const TYPE_OPTIONS: {
  value: SyllableType;
  label: string;
  example: string;
}[] = [
  { value: "direct", label: "Directas", example: "MA, PE, LI" },
  { value: "inverse", label: "Inversas", example: "AM, ES, IL" },
  { value: "blended", label: "Trabadas", example: "PLA, BRE, TRI" },
];


export default function SyllablesGame({ onBack }: Props) {
  const [selectedConsonants, setSelectedConsonants] = useState<string[]>([
    "M",
    "P",
    "L",
    "S",
    "T",
  ]);

  const [selectedTypes, setSelectedTypes] = useState<SyllableType[]>([
    "direct",
  ]);

  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<SyllableQuestion[]>([]);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<SyllableQuestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [audioRate, setAudioRate] = useState(0.6);
  const [availableVoices, setAvailableVoices] = useState<
  SpeechSynthesisVoice[]
>([]);

  const currentQuestion = questions[currentIndex];
  const answered = selectedAnswer !== null;
  const isCorrect =
    answered && selectedAnswer === currentQuestion?.target;


    

const speakSyllable = (syllable: string) => {
  if (!("speechSynthesis" in window)) {
    setError("Tu navegador no admite la reproducción de voz.");
    return;
  }

  const text = syllable
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("es-ES");

  if (!text) return;

  const synthesis = window.speechSynthesis;

  synthesis.cancel();

  // Buscar exclusivamente voces en español.
   const voices = [
    ...synthesis.getVoices(),
    ...availableVoices,
  ];

  // Priorizar una voz española de España.
  const spanishVoice =
    voices.find(
      (voice) => voice.name === "Microsoft Helena - Spanish (Spain)"
    ) ??
    voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "es-es" &&
        voice.name.toLowerCase().includes("microsoft")
    ) ??
    voices.find(
      (voice) => voice.lang.toLowerCase() === "es-es"
    );

  if (!spanishVoice) {
    setError("No encontramos una voz española de España.");
    return;
  }

 const utterance = new SpeechSynthesisUtterance(
  `${text}`
);

utterance.voice = spanishVoice;
utterance.lang = "es-ES";
utterance.rate = audioRate;
utterance.pitch = 1;

  utterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      setError("No se ha podido reproducir el audio.");
    }
  };

  synthesis.speak(utterance);
};


  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


  useEffect(() => {
  if (!("speechSynthesis" in window)) return;

  const loadVoices = () => {
    setAvailableVoices(window.speechSynthesis.getVoices());
  };

  loadVoices();

  window.speechSynthesis.addEventListener(
    "voiceschanged",
    loadVoices
  );

  return () => {
    window.speechSynthesis.removeEventListener(
      "voiceschanged",
      loadVoices
    );
  };
}, []);

useEffect(() => {
  if (started && currentQuestion && !showResults) {
    speakSyllable(currentQuestion.target);
  }
}, [started, currentIndex, questions, showResults, audioRate]);


  const availableConsonants = CONSONANTS;

  const toggleConsonant = (consonant: string) => {
    setSelectedConsonants((previous) =>
      previous.includes(consonant)
        ? previous.filter((item) => item !== consonant)
        : [...previous, consonant]
    );

    setError("");
  };

  const toggleType = (type: SyllableType) => {
    setSelectedTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type]
    );

    setError("");
  };

  const availableBlends = BLENDS.filter(
    (blend) =>
      selectedConsonants.includes(blend[0]) &&
      selectedConsonants.includes(blend[1])
  );

  const startGame = () => {
    setError("");

    if (selectedTypes.length === 0) {
      setError("Selecciona al menos un tipo de sílaba.");
      return;
    }

    if (selectedConsonants.length === 0) {
      setError("Selecciona al menos una consonante.");
      return;
    }

    if (
      selectedTypes.includes("blended") &&
      !selectedTypes.some((type) => type !== "blended") &&
      availableBlends.length === 0
    ) {
      setError(
        "Para practicar sílabas trabadas, selecciona consonantes que formen grupos como PL, BR o TR."
      );
      return;
    }

    try {
      const round = createSyllablesRound(
        questionCount,
        selectedConsonants,
        selectedTypes
      );

      if (round.length === 0) {
        setError("No hemos podido crear preguntas con esta selección.");
        return;
      }

      setQuestions(round);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setMistakes([]);
      setShowResults(false);
      setStarted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se ha podido crear la ronda."
      );
    }
  };

  const chooseAnswer = (answer: string) => {
    if (answered || !currentQuestion) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.target) {
      setScore((previous) => previous + 1);
    } else {
      setMistakes((previous) => [...previous, currentQuestion]);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const backToSettings = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setStarted(false);
    setShowResults(false);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setError("");
  };

  const restartGame = () => {
    startGame();
  };

  if (!started) {
    return (
      <main className="syllables-page">
        <button className="syllables-back" onClick={onBack}>
          ← Volver a los juegos
        </button>

        <section className="syllables-panel">
          <div className="syllables-heading">
            <span className="syllables-big-emoji">🗣️</span>
            <h1>El reto de las sílabas</h1>
            <p>
              Escucha con atención y elige la sílaba que has oído.
            </p>
          </div>

          <label className="syllables-label">
            1. Elige los tipos de sílabas
          </label>

          <p className="syllables-help">
            Puedes seleccionar uno, dos o los tres tipos para mezclarlos en
            la misma ronda.
          </p>

          <div className="syllables-type-grid">
            {TYPE_OPTIONS.map(({ value, label, example }) => {
              const active = selectedTypes.includes(value);

              return (
                <button
                  key={value}
                  type="button"
                  className={`syllables-type-choice ${
                    active ? "active" : ""
                  }`}
                  aria-pressed={active}
                  onClick={() => toggleType(value)}
                >
                  <strong>
                    {active ? "✓ " : ""}
                    {label}
                  </strong>
                  <span>{example}</span>
                </button>
              );
            })}
          </div>

          <div className="syllables-summary">
            <span>🎯</span>
            <p>
              <strong>Tipos seleccionados:</strong>{" "}
              {selectedTypes.length > 0
                ? selectedTypes.map(getSyllableTypeLabel).join(", ")
                : "Ninguno"}
              <br />
              {selectedTypes.length > 0
                ? selectedTypes
                    .map((type) => TYPE_DESCRIPTIONS[type])
                    .join(" · ")
                : "Selecciona al menos un tipo para continuar."}
            </p>
          </div>

          <label className="syllables-label">
            2. Elige las consonantes
          </label>

          <p className="syllables-help">
            Seleccionadas: {selectedConsonants.length}. Pulsa para activar o
            desactivar cada consonante.
          </p>

          <div className="syllables-letter-grid">
            {availableConsonants.map((consonant) => {
              const active = selectedConsonants.includes(consonant);

              return (
                <button
                  key={consonant}
                  type="button"
                  className={`syllables-letter ${active ? "active" : ""}`}
                  aria-pressed={active}
                  onClick={() => toggleConsonant(consonant)}
                >
                  {consonant}
                </button>
              );
            })}
          </div>

          {selectedTypes.includes("blended") && (
            <div className="syllables-blend-info">
              <strong>Grupos trabados disponibles</strong>
              <p>
                {availableBlends.join(", ") ||
                  "Aún no hay grupos válidos con estas consonantes."}
              </p>
              <small>
                Para practicar grupos como PL, BR o TR, selecciona las dos
                consonantes que forman cada grupo.
              </small>
            </div>
          )}

          <label className="syllables-label" htmlFor="syllable-count">
            3. Número de preguntas
          </label>

          <select
            id="syllable-count"
            value={questionCount}
            onChange={(event) =>
              setQuestionCount(Number(event.target.value))
            }
          >
            <option value={5}>5 preguntas</option>
            <option value={8}>8 preguntas</option>
            <option value={10}>10 preguntas</option>
          </select>

          <p className="syllables-help">
            Se crearán hasta {questionCount} preguntas diferentes, según las
            combinaciones disponibles.
          </p>

          {error && (
            <p className="syllables-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="syllables-primary"
            onClick={startGame}
            disabled={
              selectedConsonants.length === 0 ||
              selectedTypes.length === 0
            }
          >
            ¡Empezar el reto!
          </button>
        </section>
      </main>
    );
  }

  if (showResults) {
    const percentage = questions.length
      ? Math.round((score / questions.length) * 100)
      : 0;

    return (
      <main className="syllables-page">
        <section className="syllables-panel syllables-results">
          <div className="syllables-big-emoji">
            {percentage >= 80 ? "🏆" : percentage >= 50 ? "🌟" : "💪"}
          </div>

          <h1>¡Reto terminado!</h1>

          <p className="syllables-score">
            {score} de {questions.length} respuestas correctas
          </p>

          <div
            className="syllables-progress-track"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje de aciertos"
          >
            <div
              className="syllables-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p>{percentage}% de aciertos</p>

          {mistakes.length > 0 ? (
            <div className="syllables-review">
              <h2>Vamos a repasar</h2>
              <p>Estas son las sílabas que puedes volver a practicar:</p>

              <div className="syllables-review-list">
                {mistakes.map((question, index) => (
                  <div
                    key={`${question.id}-${index}`}
                    className="syllables-review-item"
                  >
                    <strong>{question.target}</strong>

                    <button
                      type="button"
                      onClick={() => speakSyllable(question.target)}
                      aria-label={`Escuchar ${question.target}`}
                    >
                      🔊 Escuchar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>¡Excelente! Has reconocido todas las sílabas.</p>
          )}

          <button className="syllables-primary" onClick={restartGame}>
            Jugar otra vez
          </button>

          <button className="syllables-secondary" onClick={backToSettings}>
            Cambiar configuración
          </button>

          <button className="syllables-back" onClick={onBack}>
            Volver a los juegos
          </button>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="syllables-page">
        <section className="syllables-panel">
          <p>No hay preguntas disponibles para esta ronda.</p>
          <button className="syllables-primary" onClick={backToSettings}>
            Volver a la configuración
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="syllables-page">
      <button className="syllables-back" onClick={backToSettings}>
        ← Cambiar configuración
      </button>

      <section className="syllables-panel syllables-playing">
        <div className="syllables-progress-header">
          <span>
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
          <span>⭐ {score} puntos</span>
        </div>

        <div className="syllables-progress-track">
          <div
            className="syllables-progress-fill"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="syllables-listen-card">
          <span className="syllables-ear">👂</span>
          <h1>¿Qué sílaba has oído?</h1>
          <p>Escucha y pulsa la respuesta correcta.</p>

          <button
            className="syllables-listen-button"
            onClick={() => speakSyllable(currentQuestion.target)}
          >
            🔊 Escuchar otra vez
          </button>
        </div>

        
<div className="syllables-speed-control">
  <label htmlFor="syllables-speed">
    🔊 Velocidad del audio
  </label>

  <div className="syllables-speed-options">
    <span>🐢 Lento</span>

    <input
      id="syllables-speed"
      type="range"
      min="0.4"
      max="1"
      step="0.1"
      value={audioRate}
      onChange={(event) =>
        setAudioRate(Number(event.target.value))
      }
    />

    <span>🐇 Rápido</span>
  </div>

  <p>
    {audioRate <= 0.5
      ? "Muy despacio"
      : audioRate <= 0.7
        ? "Ritmo tranquilo"
        : "Ritmo normal"}
  </p>
</div>


        <div className="syllables-options">
          {currentQuestion.options.map((option) => {
            let stateClass = "";

            if (answered && option === currentQuestion.target) {
              stateClass = "correct";
            } else if (answered && option === selectedAnswer) {
              stateClass = "incorrect";
            }

            return (
              <button
                key={option}
                type="button"
                className={`syllables-option ${stateClass}`}
                onClick={() => chooseAnswer(option)}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`syllables-feedback ${
              isCorrect ? "success" : "try-again"
            }`}
            role="status"
          >
            <strong>
              {isCorrect ? "¡Muy bien! 🎉" : "¡Vamos a aprender! 💛"}
            </strong>

            <p>
              {isCorrect
                ? `Has reconocido ${currentQuestion.target}.`
                : `La respuesta correcta era ${currentQuestion.target}.`}
            </p>
          </div>
        )}

        <button
          className="syllables-primary"
          onClick={nextQuestion}
          disabled={!answered}
        >
          {currentIndex + 1 === questions.length
            ? "Ver resultados"
            : "Siguiente pregunta →"}
        </button>
      </section>
    </main>
  );
}
