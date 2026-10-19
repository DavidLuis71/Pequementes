
import { useState } from "react";
import "./LettersGame.css";

type WordQuestion = {
  id: number;
  word: string;
  emoji: string;
  hint: string;
};

type Level = "short" | "medium" | "long";


const wordQuestions: WordQuestion[] = [
  // PALABRAS CORTAS: 3-4 letras (30)

  { id: 1, word: "SOL", emoji: "☀️", hint: "Nos da luz y calor." },
  { id: 2, word: "MAR", emoji: "🌊", hint: "Tiene olas y agua salada." },
  { id: 3, word: "PAN", emoji: "🍞", hint: "Es un alimento que podemos comer." },
  { id: 4, word: "GATO", emoji: "🐱", hint: "Es un animal que maúlla." },
  { id: 5, word: "CASA", emoji: "🏠", hint: "Es el lugar donde vivimos." },
  { id: 6, word: "LUNA", emoji: "🌙", hint: "La vemos en el cielo por la noche." },
  { id: 7, word: "PATO", emoji: "🦆", hint: "Es un animal que nada y hace cuac." },
  { id: 8, word: "FLOR", emoji: "🌷", hint: "Crece en las plantas y puede tener pétalos." },
  { id: 9, word: "MANO", emoji: "✋", hint: "La usamos para agarrar cosas." },
  { id: 10, word: "MESA", emoji: "🪑", hint: "La usamos para comer o trabajar." },
  { id: 11, word: "PEZ", emoji: "🐟", hint: "Vive en el agua y tiene aletas." },
  { id: 12, word: "LUZ", emoji: "💡", hint: "Nos permite ver cuando hay claridad." },
  { id: 13, word: "SAL", emoji: "🧂", hint: "La usamos para dar sabor a la comida." },
  { id: 14, word: "PIE", emoji: "🦶", hint: "Lo usamos para caminar." },
  { id: 15, word: "PAN", emoji: "🥖", hint: "Se hace con harina y se suele hornear." },
  { id: 16, word: "REY", emoji: "👑", hint: "Es una figura que puede gobernar un reino." },
  { id: 17, word: "UVA", emoji: "🍇", hint: "Es una fruta pequeña que crece en racimos." },
  { id: 18, word: "OSO", emoji: "🐻", hint: "Es un animal grande y peludo." },
  { id: 19, word: "AVE", emoji: "🐦", hint: "Es un animal que tiene plumas." },
  { id: 20, word: "ARO", emoji: "⭕", hint: "Es una pieza redonda." },
  { id: 21, word: "DADO", emoji: "🎲", hint: "Tiene puntos y se usa en algunos juegos." },
  { id: 22, word: "DEDO", emoji: "☝️", hint: "Tenemos varios en cada mano." },
  { id: 23, word: "BOCA", emoji: "👄", hint: "La usamos para hablar y comer." },
  { id: 24, word: "ROSA", emoji: "🌹", hint: "Es una flor que puede tener espinas." },
  { id: 25, word: "LEÓN", emoji: "🦁", hint: "Es un felino conocido por su melena." },
  { id: 26, word: "FOCA", emoji: "🦭", hint: "Es un animal marino que nada muy bien." },
  { id: 27, word: "RANA", emoji: "🐸", hint: "Es un animal que salta y puede vivir cerca del agua." },
  { id: 28, word: "LOBO", emoji: "🐺", hint: "Es un animal salvaje parecido al perro." },
  { id: 29, word: "TREN", emoji: "🚂", hint: "Es un transporte que circula por raíles." },
  { id: 30, word: "CAMA", emoji: "🛏️", hint: "La usamos para dormir." },

  // PALABRAS MEDIAS: 5-6 letras (24)

  { id: 31, word: "PERRO", emoji: "🐶", hint: "Es un animal que ladra." },
  { id: 32, word: "NUBES", emoji: "☁️", hint: "Flotan en el cielo." },
  { id: 33, word: "LIBRO", emoji: "📚", hint: "Tiene páginas y podemos leerlo." },
  { id: 34, word: "PLATO", emoji: "🍽️", hint: "Ponemos la comida encima." },
  { id: 35, word: "CAMISA", emoji: "👕", hint: "Es una prenda de vestir." },
  { id: 36, word: "PELOTA", emoji: "⚽", hint: "Podemos lanzarla o darle patadas." },
  { id: 37, word: "CONEJO", emoji: "🐰", hint: "Tiene orejas largas y salta." },
  { id: 38, word: "VENTANA", emoji: "🪟", hint: "Nos permite mirar hacia fuera." },
  { id: 39, word: "QUESO", emoji: "🧀", hint: "Es un alimento elaborado con leche." },
  { id: 40, word: "SILLA", emoji: "🪑", hint: "Nos sentamos en ella." },
  { id: 41, word: "GORRA", emoji: "🧢", hint: "Es una prenda que cubre la cabeza." },
  { id: 42, word: "ZAPATO", emoji: "👟", hint: "Nos lo ponemos en los pies." },
  { id: 43, word: "PLANTA", emoji: "🪴", hint: "Es un ser vivo que necesita agua y luz." },
  { id: 44, word: "LLUVIA", emoji: "🌧️", hint: "Cae de las nubes." },
  { id: 45, word: "COCHE", emoji: "🚗", hint: "Es un vehículo que circula por la carretera." },
  { id: 46, word: "ABEJA", emoji: "🐝", hint: "Es un insecto que produce miel." },
  { id: 47, word: "MONO", emoji: "🐒", hint: "Es un animal que trepa a los árboles." },
  { id: 48, word: "QUESO", emoji: "🧀", hint: "Puede ser fresco o curado y se come." },
  { id: 49, word: "GAFAS", emoji: "👓", hint: "Nos ayudan a ver mejor." },
  { id: 50, word: "BARCO", emoji: "⛵", hint: "Sirve para viajar por el agua." },
  { id: 51, word: "DULCE", emoji: "🍬", hint: "Tiene sabor azucarado." },
  { id: 52, word: "NARIZ", emoji: "👃", hint: "La usamos para oler." },
  { id: 53, word: "JABÓN", emoji: "🧼", hint: "Lo usamos para lavarnos." },
  { id: 54, word: "BOLSA", emoji: "🛍️", hint: "Sirve para llevar objetos." },

  // PALABRAS LARGAS: 7 o más letras (21)

  { id: 55, word: "MARIPOSA", emoji: "🦋", hint: "Es un insecto con alas de colores." },
  { id: 56, word: "CHOCOLATE", emoji: "🍫", hint: "Es un alimento dulce hecho con cacao." },
  { id: 57, word: "BICICLETA", emoji: "🚲", hint: "Tiene dos ruedas y pedales." },
  { id: 58, word: "ELEFANTE", emoji: "🐘", hint: "Es un animal grande con trompa." },
  { id: 59, word: "DINOSAURIO", emoji: "🦕", hint: "Es un animal que vivió hace millones de años." },
  { id: 60, word: "BOMBEROS", emoji: "🚒", hint: "Ayudan a apagar incendios." },
  { id: 61, word: "ORDENADOR", emoji: "💻", hint: "Sirve para trabajar, aprender y jugar." },
  { id: 62, word: "MARINERO", emoji: "⚓", hint: "Es una persona que trabaja en un barco." },
  { id: 63, word: "CARACOLA", emoji: "🐚", hint: "Es una concha que podemos encontrar en la playa." },
  { id: 64, word: "TELEFONO", emoji: "📱", hint: "Sirve para comunicarnos con otras personas." },
  { id: 65, word: "GIRASOL", emoji: "🌻", hint: "Es una flor grande que sigue la luz del sol." },
  { id: 66, word: "COCODRILO", emoji: "🐊", hint: "Es un reptil grande que vive cerca del agua." },
  { id: 67, word: "HELICOPTERO", emoji: "🚁", hint: "Es una aeronave con hélices." },
  { id: 68, word: "BIBLIOTECA", emoji: "📚", hint: "Es un lugar donde podemos leer y pedir libros." },
  { id: 69, word: "PIRULETA", emoji: "🍭", hint: "Es un dulce que tiene un palito." },
  { id: 70, word: "ZANAHORIA", emoji: "🥕", hint: "Es una hortaliza de color naranja." },
  { id: 71, word: "PANTALONES", emoji: "👖", hint: "Es una prenda que cubre las piernas." },
  { id: 72, word: "MARINERA", emoji: "⛵", hint: "Palabra relacionada con el mar o con una persona que navega." },
  { id: 73, word: "ORDENADOR", emoji: "🖥️", hint: "Es un dispositivo electrónico para trabajar y aprender." },
  { id: 74, word: "AVIONETA", emoji: "🛩️", hint: "Es un avión pequeño." },
  { id: 75, word: "LAVADORA", emoji: "🧺", hint: "Es una máquina que lava la ropa." },
];

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

function getLevelQuestions(level: Level): WordQuestion[] {
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

  const question = questions[questionIndex];

  function startGame(selectedLevel: Level) {
    const availableQuestions = shuffle(getLevelQuestions(selectedLevel));
    const round = availableQuestions.slice(0, 10);

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

          <div className="letters-levels">
            {levels.map((item) => (
              <button
                key={item.id}
                className={`letters-level-card letters-level-${item.id}`}
                onClick={() => startGame(item.id)}
              >
                <span className="letters-level-emoji">{item.emoji}</span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>
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