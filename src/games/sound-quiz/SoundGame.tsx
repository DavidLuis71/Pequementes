import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CATEGORIES, LEVELS } from "./soundCategories";
import type {
  Difficulty,
  SoundCategory,
} from "./soundCategories";
import "./SoundGame.css";

// const API_ORIGIN = "https://api.lotsofsounds.com";
// const API_BASE = "/lotsofsounds";
// const SAMPLE_ENDPOINT = `${API_BASE}/api/v1/sounds/sample`;

const API_ORIGIN = "https://api.lotsofsounds.com";
const SAMPLE_ENDPOINT = "/api/sounds.php";

//este en local no fucniona pero en hostinger si, gracias al php de hstinger, si descomentas si funciona en local.
type Sound = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  duration?: number;
  stream_url?: string;
};

type SearchResponse = {
  data?: Sound[] | { sounds?: Sound[] };
  sounds?: Sound[];
};

type StreamResponse = {
  stream_url?: string;
  data?: {
    stream_url?: string;
  };
};


type Question = {
  sound: Sound;
  correct: SoundCategory;
  options: SoundCategory[];
};

type Props = {
  onBack: () => void;
};


function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Comprueba el nombre y las etiquetas del sonido.
 * No usa la descripción, ya que puede mencionar sonidos
 * que realmente no aparecen en el audio.
 */
function matchesCategory(
  sound: Sound,
  category: SoundCategory
): boolean {
  const metadata = normalize(
    [
      sound.name,
      sound.description ?? "",
      ...(sound.tags ?? []),
    ].join(" ")
  );

  const keywords = category.keywords.map(normalize);

  // Primero intentamos encontrar una coincidencia precisa.
  if (
    keywords.some((keyword) => metadata.includes(keyword))
  ) {
    return true;
  }

  // Si la API utiliza nombres alternativos, comprobamos
  // también las palabras principales de la búsqueda.
  const searchWords = normalize(category.query)
    .split(" ")
    .filter(
      (word) =>
        word.length >= 4 &&
        !["isolated", "sound", "effect"].includes(word)
    );

  return searchWords.some((word) => {
    const escaped = word.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(
      metadata
    );
  });
}

function getSoundsFromResponse(
  result: SearchResponse
): Sound[] {
  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (result.data && !Array.isArray(result.data)) {
    return result.data.sounds ?? [];
  }

  return result.sounds ?? [];
}

async function searchSounds(
  category: SoundCategory
): Promise<Sound[]> {
  const queries = [
    category.query,
    category.label,
    category.keywords[0],
  ];

  const seen = new Set<string>();
  const collected: Sound[] = [];

  for (const query of queries) {
    const params = new URLSearchParams({
      q: query,
      limit: "12",
    });

    const response = await fetch(
      `${SAMPLE_ENDPOINT}?${params.toString()}`
    );

    if (!response.ok) {
      continue;
    }

    const result: SearchResponse = await response.json();
    const sounds = getSoundsFromResponse(result);

    for (const sound of sounds) {
      if (!sound.id || seen.has(sound.id)) {
        continue;
      }

      seen.add(sound.id);

      if (matchesCategory(sound, category)) {
        collected.push(sound);
      }
    }

    // Con suficientes resultados no hace falta seguir buscando.
    if (collected.length >= 7) {
      break;
    }
  }

  return collected;
}

export default function SoundGame({ onBack }: Props) {
  const [selectedLevel, setSelectedLevel] =
    useState<Difficulty>(1);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
  if (finished) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [finished]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentLevel = LEVELS.find(
    (level) => level.id === selectedLevel
  );

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setPlaying(false);
  }

  async function startGame() {
    stopAudio();
    setLoading(true);
    setError("");
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setStarted(false);

    try {
      const categories = shuffle(
        CATEGORIES.filter(
          (category) => category.level === selectedLevel
        )
      );

      const results = await Promise.all(
        categories.map(async (category) => {
          try {
            const sounds = await searchSounds(category);

            if (sounds.length === 0) {
              return null;
            }

            const sound = shuffle(sounds)[0];

            const distractors = shuffle(
              CATEGORIES.filter(
                (item) =>
                  item.level === selectedLevel &&
                  item.id !== category.id
              )
            ).slice(0, 2);

            if (distractors.length < 2) {
              return null;
            }

            return {
              sound,
              correct: category,
              options: shuffle([
                category,
                ...distractors,
              ]),
            } satisfies Question;
          } catch {
            // Si falla una categoría, intentamos continuar
            // con las demás.
            return null;
          }
        })
      );

      const validQuestions = shuffle(
        results.filter(
          (question): question is Question =>
            question !== null
        )
      );

      if (validQuestions.length === 0) {
        setError(
          "No hemos encontrado sonidos adecuados para este nivel. Comprueba tu conexión e inténtalo de nuevo."
        );
        return;
      }

      setQuestions(validQuestions);
      setStarted(true);
    } catch {
      setError(
        "No se han podido cargar los sonidos. Comprueba tu conexión e inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

async function playSound() {
  if (!currentQuestion) return;

  stopAudio();
  setError("");

  try {
    const soundId = currentQuestion.sound.id;

    // const response = await fetch(
    //   `${API_BASE}/api/v1/sounds/sample/${encodeURIComponent(
    //     soundId
    //   )}/stream`
    // );

const response = await fetch(
  `${SAMPLE_ENDPOINT}?path=stream&id=${encodeURIComponent(
    soundId
  )}`
);

    if (!response.ok) {
      throw new Error(
        `Error al obtener el audio: HTTP ${response.status}`
      );
    }

    const result: StreamResponse = await response.json();

    const streamUrl =
      result.stream_url ?? result.data?.stream_url;

    if (!streamUrl) {
      console.error("Respuesta del endpoint de audio:", result);
      throw new Error("La API no ha devuelto una URL de audio.");
    }

    // Si la API devuelve una URL relativa, la convertimos
    // en una dirección absoluta.
    const audioUrl = new URL(
      streamUrl,
      API_ORIGIN
    ).href;

    console.log("URL del audio:", audioUrl);

    const audio = new Audio();
    audioRef.current = audio;

    audio.preload = "auto";
    audio.src = audioUrl;

    audio.onended = () => {
      setPlaying(false);
    };

    audio.onerror = () => {
      console.error(
        "Error del elemento de audio:",
        audio.error,
        audio.currentSrc
      );

      setPlaying(false);
      setError(
        "No se puede cargar este audio. Prueba con otro sonido."
      );
    };

    await audio.play();
    setPlaying(true);
  } catch (error) {
    console.error("Error reproduciendo el sonido:", error);

    setPlaying(false);
    setError(
      error instanceof Error
        ? error.message
        : "No se ha podido reproducir el sonido."
    );
  }
}
  function answerQuestion(categoryId: string) {
    if (!currentQuestion || selectedAnswer !== null) {
      return;
    }

    stopAudio();
    setSelectedAnswer(categoryId);

    if (categoryId === currentQuestion.correct.id) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function nextQuestion() {
    stopAudio();

    if (currentIndex + 1 >= totalQuestions) {
      setFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer(null);
    setError("");
  }

  function restartGame() {
    stopAudio();
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStarted(false);
    setFinished(false);
    setError("");
  }

  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  return (
    <main className="sound-quiz">
      <div className="sound-quiz-container">
        {/* CABECERA */}
        <header className="sound-quiz-header">
          <button
            type="button"
            className="sound-quiz-back"
            onClick={() => {
              stopAudio();
              onBack();
            }}
          >
            ← Volver
          </button>

          <div className="sound-quiz-brand">
            <span className="sound-quiz-brand-icon">👂</span>
            <span>PequeMentes</span>
          </div>
        </header>

        {/* PANTALLA INICIAL */}
        {!started && !finished && (
          <section className="sound-quiz-intro">
            <div className="sound-quiz-hero-icon">🎧</div>

            <p className="sound-quiz-eyebrow">
              JUEGO DE ESCUCHA
            </p>

            <h1>¿Qué sonido es?</h1>

            <p className="sound-quiz-description">
              Escucha con atención y descubre qué animal
              u objeto produce cada sonido.
            </p>

            {/* SELECCIÓN DE NIVEL */}
            <div className="sound-quiz-levels">
              <h2>Elige tu nivel</h2>

              <div className="sound-quiz-level-grid">
                {LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    className={`sound-quiz-level ${
                      selectedLevel === level.id
                        ? "is-selected"
                        : ""
                    }`}
                    style={
                      {
                        "--level-color": level.color,
                      } as CSSProperties
                    }
                    aria-pressed={
                      selectedLevel === level.id
                    }
                    onClick={() =>
                      setSelectedLevel(level.id)
                    }
                  >
                    <span className="sound-quiz-level-emoji">
                      {level.emoji}
                    </span>

                    <strong>{level.name}</strong>

                    <small>{level.description}</small>

                    {selectedLevel === level.id && (
                      <span className="sound-quiz-level-check">
                        ✓ Seleccionado
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="sound-quiz-instructions">
              <div>
                <span>🔊</span>
                <p>
                  <strong>Escucha</strong>
                  <small>Pulsa el botón para oír el sonido.</small>
                </p>
              </div>

              <div>
                <span>🤔</span>
                <p>
                  <strong>Piensa</strong>
                  <small>Elige una de las tres respuestas.</small>
                </p>
              </div>

              <div>
                <span>⭐</span>
                <p>
                  <strong>Consigue puntos</strong>
                  <small>¡Acierta tantas como puedas!</small>
                </p>
              </div>
            </div>

            {error && (
              <p
                className="sound-quiz-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              className="sound-quiz-primary"
              onClick={startGame}
              disabled={loading}
            >
              {loading
                ? "Preparando sonidos..."
                : `¡Empezar! ${currentLevel?.emoji ?? "🎵"}`}
            </button>

            <p className="sound-quiz-small-note">
             Cada partida descubre nuevos sonidos.
            ¡Escucha con atención y demuestra lo que sabes!
            </p>
          </section>
        )}

        {/* PANTALLA DE JUEGO */}
        {started && currentQuestion && (
          <section className="sound-quiz-game">
            <div className="sound-quiz-game-top">
              <div className="sound-quiz-level-badge">
                {currentLevel?.emoji} {currentLevel?.name}
              </div>

              <div className="sound-quiz-score">
                ⭐ {score} puntos
              </div>
            </div>

            <div className="sound-quiz-progress-info">
              <span>Pregunta {currentIndex + 1}</span>
              <span>de {totalQuestions}</span>
            </div>

            <div
              className="sound-quiz-progress"
              role="progressbar"
              aria-label="Progreso del juego"
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
              aria-valuenow={currentIndex + 1}
            >
              <div
                className="sound-quiz-progress-fill"
                style={{
                  width: `${
                    ((currentIndex + 1) / totalQuestions) *
                    100
                  }%`,
                }}
              />
            </div>

            <div className="sound-quiz-question">
              <div className="sound-quiz-listen-icon">
                {playing ? "🔊" : "🎧"}
              </div>

              <h1>¿Qué estás escuchando?</h1>

              <p>
                Escucha el sonido y elige la respuesta correcta.
              </p>

              <button
                type="button"
                className="sound-quiz-play"
                onClick={playSound}
                disabled={playing}
              >
                <span>{playing ? "🔊" : "▶️"}</span>
                {playing
                  ? "Reproduciendo..."
                  : "Escuchar sonido"}
              </button>

              <button
                type="button"
                className="sound-quiz-replay"
                onClick={playSound}
                disabled={playing}
              >
                ↻ Volver a escuchar
              </button>
            </div>

            <div className="sound-quiz-options">
              {currentQuestion.options.map((option) => {
                const isCorrect =
                  option.id === currentQuestion.correct.id;

                const isSelected =
                  selectedAnswer === option.id;

                let className = "sound-quiz-option";

                if (selectedAnswer !== null && isCorrect) {
                  className += " is-correct";
                } else if (isSelected && !isCorrect) {
                  className += " is-incorrect";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={className}
                    onClick={() =>
                      answerQuestion(option.id)
                    }
                    disabled={selectedAnswer !== null}
                  >
                    <span className="sound-quiz-option-emoji">
                      {option.emoji}
                    </span>

                    <span className="sound-quiz-option-label">
                      {option.label}
                    </span>

                    {selectedAnswer !== null && isCorrect && (
                      <span className="sound-quiz-option-status">
                        ✓
                      </span>
                    )}

                    {isSelected && !isCorrect && (
                      <span className="sound-quiz-option-status">
                        ✗
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div
                className={`sound-quiz-feedback ${
                  selectedAnswer === currentQuestion.correct.id
                    ? "is-correct"
                    : "is-incorrect"
                }`}
                role="status"
              >
                <span className="sound-quiz-feedback-emoji">
                  {selectedAnswer === currentQuestion.correct.id
                    ? "🎉"
                    : "💪"}
                </span>

                <div>
                  <strong>
                    {selectedAnswer === currentQuestion.correct.id
                      ? "¡Muy bien!"
                      : "¡Sigue intentándolo!"}
                  </strong>

                  <p>
                    {selectedAnswer === currentQuestion.correct.id
                      ? "Has acertado. ¡Has conseguido un punto!"
                      : `La respuesta correcta es ${currentQuestion.correct.label}.`}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <p
                className="sound-quiz-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {selectedAnswer !== null && (
              <button
                type="button"
                className="sound-quiz-primary"
                onClick={nextQuestion}
              >
                {currentIndex + 1 >= totalQuestions
                  ? "Ver resultados 🏆"
                  : "Siguiente pregunta →"}
              </button>
            )}
          </section>
        )}

        {/* PANTALLA FINAL */}
        {finished && (
          <section className="sound-quiz-results">
            <div className="sound-quiz-results-icon">
              {percentage === 100
                ? "🏆"
                : percentage >= 60
                  ? "🌟"
                  : "💛"}
            </div>

            <p className="sound-quiz-eyebrow">
              ¡JUEGO COMPLETADO!
            </p>

            <h1>
              {percentage === 100
                ? "¡Perfecto!"
                : percentage >= 60
                  ? "¡Muy buen trabajo!"
                  : "¡Buen intento!"}
            </h1>

            <p className="sound-quiz-description">
              {percentage === 100
                ? "¡Has reconocido todos los sonidos!"
                : percentage >= 60
                  ? "¡Cada vez reconoces mejor los sonidos!"
                  : "Practica un poquito más y pronto lo conseguirás."}
            </p>

            <div className="sound-quiz-final-score">
              <span>⭐</span>
              <strong>
                {score} de {totalQuestions}
              </strong>
              <small>respuestas correctas</small>
            </div>

            <div className="sound-quiz-result-progress">
              <div
                className="sound-quiz-progress"
                role="progressbar"
                aria-label="Resultado final"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div
                  className="sound-quiz-progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <strong>{percentage}% de aciertos</strong>
            </div>

            <button
              type="button"
              className="sound-quiz-primary"
              onClick={restartGame}
            >
              🔄 Jugar otra vez
            </button>

            <button
              type="button"
              className="sound-quiz-secondary"
              onClick={() => {
                stopAudio();
                onBack();
              }}
            >
              Volver al menú
            </button>
          </section>
        )}
      </div>
    </main>
  );
}