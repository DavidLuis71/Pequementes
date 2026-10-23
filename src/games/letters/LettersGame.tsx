import { useEffect, useState } from "react";
import "./LettersGame.css";

type WordQuestion = {
  id: number;
  word: string;
  emoji: string;
  hint: string;
};

type Level = "short" | "medium" | "long";


type EmojiReachItem = {
  char: string;
  name: string;
  group?: string;
  keywords?: string[];
};

type EmojiReachResponse = {
  count: number;
  emoji: EmojiReachItem[];
};

const EMOJI_REACH_URL = "https://emojireach.com/api/v1/emojis.es.json";

function createHint(item: EmojiReachItem): string {
  const group = (item.group ?? "").toLowerCase();

  if (group.includes("animal")) return "Es un animal. ¿Cómo se escribe su nombre?";
  if (group.includes("food") || group.includes("comida") || group.includes("fruta"))
    return "Es algo que podemos comer.";
  if (group.includes("plant") || group.includes("planta") || group.includes("flor"))
    return "Es algo que encontramos en la naturaleza.";
  if (group.includes("travel") || group.includes("transporte"))
    return "Sirve para viajar o desplazarse.";
  if (group.includes("nature") || group.includes("naturaleza"))
    return "Es algo que encontramos en la naturaleza.";

  return "Mira el emoji y forma su nombre con las letras.";
}

const ENGLISH_WORDS = new Set([
  "LACROSSE",
  "JOISTIC",
   "ALAMBIQUE",
  "JOYSTICK",
  "RUGBY",
  "HOCKEY",
  "SKATEBOARD",
   "CIGARRILLO",
   "FALAFEL",
  "SNOWBOARD",
  "BASEBALL",
  "BASKETBALL",
  "FOOTBALL",
  "CUPCAKE",
  "BROWNIE",
  "MUFFIN",
  "SANDWICH",
  "POPCORN",
  "BURGER",
  "COOKIE",
  "DONUT",
  "WAFFLE",
  "PRETZEL",
  "CROISSANT",
]);

function isSuitableSpanishWord(word: string): boolean {
  if (!/^[A-ZÁÉÍÓÚÜÑ]{3,12}$/.test(word)) return false;
  if (ENGLISH_WORDS.has(word)) return false;

  return true;
}


function normalizeEmojiQuestions(items: EmojiReachItem[]): WordQuestion[] {
  const seen = new Set<string>();

  return items
    .filter((item) => typeof item.char === "string" && typeof item.name === "string")
    .map((item, index) => ({
      id: index + 1,
      word: item.name.trim().toLocaleUpperCase("es"),
      emoji: item.char,
      hint: createHint(item),
    }))
    // Para que el tren sea sencillo, de momento usamos nombres de una sola palabra.
    .filter((item) => isSuitableSpanishWord(item.word))
    .filter((item) => {
      if (seen.has(item.word)) return false;
      seen.add(item.word);
      return true;
    });
}

const levels: {
  id: Level;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    id: "short",
    title: "Palabras cortas",
    description: "De 3 a 4 letras",
    emoji: "🌱",
  },
  {
    id: "medium",
    title: "Palabras medias",
    description: "De 5 a 6 letras",
    emoji: "🌻",
  },
  {
    id: "long",
    title: "Palabras largas",
    description: "De 7 letras en adelante",
    emoji: "🚀",
  },
];

function shuffle<T,>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getLevelQuestions(level: Level, wordQuestions: WordQuestion[]): WordQuestion[] {
  return wordQuestions.filter((question) => {
    const length = question.word.length;

    if (level === "short") return length >= 3 && length <= 4;
    if (level === "medium") return length >= 5 && length <= 6;

    return length >= 7;
  });
}

function createLetters(word: string): string[] {
  const original = word.split("");
  let shuffled = shuffle(original);

  for (let attempts = 0; attempts < 20; attempts++) {
    if (shuffled.join("") !== word) return shuffled;
    shuffled = shuffle(original);
  }

  // Evita que la palabra aparezca ordenada desde el principio.
  return [...original.slice(1), original[0]];
}

export default function LettersGame({
  onBack,
}: {
  onBack: () => void;
}) {
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<WordQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [letters, setLetters] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wordQuestions, setWordQuestions] = useState<WordQuestion[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEmojis() {
      try {
        setApiLoading(true);
        setApiError(null);

        const response = await fetch(EMOJI_REACH_URL);
        if (!response.ok) {
          throw new Error(`La API respondió con el estado ${response.status}.`);
        }

        const data = (await response.json()) as EmojiReachResponse;
        const questionsFromApi = normalizeEmojiQuestions(data.emoji ?? []);

        if (!questionsFromApi.length) {
          throw new Error("La API no devolvió palabras válidas en español.");
        }

        if (!cancelled) setWordQuestions(questionsFromApi);
      } catch (error) {
        if (!cancelled) {
          setApiError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los emojis."
          );
        }
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    }

    void loadEmojis();

    return () => {
      cancelled = true;
    };
  }, []);

  const question = questions[questionIndex];

  function startGame(selectedLevel: Level) {
    const availableQuestions = shuffle(getLevelQuestions(selectedLevel, wordQuestions));
    const round = availableQuestions.slice(0, 10);

    if (round.length === 0) {
      setApiError("No hay suficientes palabras para este nivel. Prueba otro nivel.");
      return;
    }

    setApiError(null);
    setLevel(selectedLevel);
    setQuestions(round);
    setQuestionIndex(0);
    setSelected([]);
    setLetters(createLetters(round[0].word));
    setFeedback(null);
    setShowHint(false);
    setScore(0);
    setFinished(false);
  }

  function chooseLetter(index: number) {
    if (feedback === "correct" || selected.includes(index)) return;

    setSelected((previous) => [...previous, index]);
    setFeedback(null);
  }

  function removeLetter(position: number) {
    if (feedback === "correct") return;

    setSelected((previous) =>
      previous.filter((_, index) => index !== position)
    );
    setFeedback(null);
  }

  function checkAnswer() {
    const answer = selected.map((index) => letters[index]).join("");

    if (answer === question.word) {
      setFeedback("correct");
      setScore((previous) => previous + 1);
    } else {
      setFeedback("wrong");
    }
  }

  function nextQuestion() {
    if (questionIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    const nextIndex = questionIndex + 1;

    setQuestionIndex(nextIndex);
    setLetters(createLetters(questions[nextIndex].word));
    setSelected([]);
    setFeedback(null);
    setShowHint(false);
  }

  if (level === null) {
    return (
      <main className="letters-game">
        <header className="letters-header">
          <button className="letters-back-button" onClick={onBack}>
            ← Volver
          </button>
        </header>

        <section className="letters-panel">
          <div className="letters-title-icon">🚂</div>
          <h1>El tren de las letras</h1>
          <p className="letters-subtitle">
            Elige tu nivel y empieza a formar palabras.
          </p>

          {apiLoading && (
            <p className="letters-subtitle">Cargando palabras y emojis desde EmojiReach…</p>
          )}

          {apiError && (
            <div className="letters-feedback letters-feedback-wrong" role="alert">
              {apiError}
              <button
                className="letters-secondary-button"
                onClick={() => window.location.reload()}
                style={{ marginLeft: "0.75rem" }}
              >
                Volver a cargar
              </button>
            </div>
          )}

          {/* {!apiLoading && !apiError && (
            <p className="letters-subtitle">
              Se han cargado {wordQuestions.length} palabras desde EmojiReach.
            </p>
          )} */}

          <div className="letters-levels">
            {levels.map((item) => (
              <button
                key={item.id}
                className={`letters-level-card letters-level-${item.id}`}
                onClick={() => startGame(item.id)}
                disabled={apiLoading || !!apiError}
              >
                <span className="letters-level-emoji">{item.emoji}</span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>
          <p className="letters-subtitle" style={{ fontSize: "0.8rem", marginTop: "1rem" }}>
            Datos de emojis: <a href="https://emojireach.com/api" target="_blank" rel="noreferrer">EmojiReach</a> · CC BY 4.0
          </p>
        </section>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="letters-game">
        <section className="letters-panel letters-results">
          <div className="letters-big-emoji">🏆</div>
          <h1>¡Lo has conseguido!</h1>
          <p>
            Has formado correctamente {score} de {questions.length} palabras.
          </p>

          <div className="letters-result-score">
            {score} / {questions.length}
          </div>

          <button
            className="letters-primary-button"
            onClick={() => startGame(level)}
          >
            Repetir nivel
          </button>

          <button
            className="letters-secondary-button"
            onClick={() => setLevel(null)}
          >
            Elegir otro nivel
          </button>

          <button className="letters-secondary-button" onClick={onBack}>
            Volver al menú
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="letters-game">
      <header className="letters-header">
        <button className="letters-back-button" onClick={onBack}>
          ← Volver
        </button>

        <div className="letters-progress">
          Palabra {questionIndex + 1} de {questions.length}
        </div>

        <div className="letters-score">⭐ {score}</div>
      </header>

      <section className="letters-panel">
        <div className="letters-title-icon">🔤</div>
        <h1>El tren de las letras</h1>
        <p className="letters-subtitle">
          {levels.find((item) => item.id === level)?.title}
        </p>

        <div className="letters-progress-track">
          <div
            className="letters-progress-fill"
            style={{
              width: `${((questionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="letters-picture" aria-label="Imagen de la palabra">
          {question.emoji}
        </div>

        <h2>¿Qué palabra se esconde?</h2>
        <p className="letters-instruction">
          Pulsa las letras en el orden correcto.
        </p>

        <div className="letters-answer" aria-label="Tu palabra">
          {question.word.split("").map((_, position) => {
            const letterIndex = selected[position];

            return (
              <button
                key={position}
                className={`letters-answer-slot ${
                  letterIndex !== undefined ? "has-letter" : ""
                }`}
                onClick={() => {
                  if (letterIndex !== undefined) removeLetter(position);
                }}
                aria-label={
                  letterIndex !== undefined
                    ? `Quitar letra ${letters[letterIndex]}`
                    : "Espacio vacío"
                }
              >
                {letterIndex !== undefined ? letters[letterIndex] : ""}
              </button>
            );
          })}
        </div>

        <div className="letters-options" aria-label="Letras disponibles">
          {letters.map((letter, index) => (
            <button
              key={index}
              className={`letters-option ${
                selected.includes(index) ? "letters-option-used" : ""
              }`}
              onClick={() => chooseLetter(index)}
              disabled={selected.includes(index) || feedback === "correct"}
            >
              {letter}
            </button>
          ))}
        </div>

        {showHint && <div className="letters-hint">💡 {question.hint}</div>}

        {feedback === "correct" && (
          <div className="letters-feedback letters-feedback-correct">
            🎉 ¡Muy bien! Has formado {question.word}.
          </div>
        )}

        {feedback === "wrong" && (
          <div className="letters-feedback letters-feedback-wrong">
            ¡Casi! Revisa el orden de las letras e inténtalo de nuevo.
          </div>
        )}

        <div className="letters-actions">
          <button
            className="letters-secondary-button"
            onClick={() => {
              setSelected([]);
              setFeedback(null);
            }}
            disabled={selected.length === 0 || feedback === "correct"}
          >
            Borrar
          </button>

          <button
            className="letters-hint-button"
            onClick={() => setShowHint((previous) => !previous)}
          >
            {showHint ? "Ocultar pista" : "Pista 💡"}
          </button>

          {feedback === "correct" ? (
            <button className="letters-primary-button" onClick={nextQuestion}>
              {questionIndex + 1 === questions.length
                ? "Ver resultado"
                : "Siguiente →"}
            </button>
          ) : (
            <button
              className="letters-primary-button"
              onClick={checkAnswer}
              disabled={selected.length !== question.word.length}
            >
              Comprobar
            </button>
          )}
        </div>
      </section>
    </main>
  );
}