
import { useState } from "react";
import {
  albumQuestions,
  type AlbumQuestion,
} from "../../data/albumQuestions";

type AlbumGameProps = {
  onBack: () => void;
};


const illustrations: Record<string, string> = {
  // Animales
  Perro: "🐶",
  Gato: "🐱",
  Conejo: "🐰",
  León: "🦁",
  Tigre: "🐯",
  Leopardo: "🐆",
  Caballo: "🐴",
  Burro: "🫏",
  Oveja: "🐑",
  Águila: "🦅",
  Paloma: "🕊️",
  Gorrión: "🐦",
  Rana: "🐸",
  Sapo: "🐸",
  Salamandra: "🦎",
  Vaca: "🐮",
  Cerdo: "🐷",
  Gallina: "🐔",
  Tortuga: "🐢",
  Pez: "🐟",
  Delfín: "🐬",
  Tiburón: "🦈",
  Pulpo: "🐙",
  Calamar: "🦑",
  Sepia: "🦑",
  Mariposa: "🦋",
  Abeja: "🐝",
  Hormiga: "🐜",
  Escarabajo: "🪲",
  Saltamontes: "🦗",
  Libélula: "🪰",

  // Frutas y verduras
  Manzana: "🍎",
  Plátano: "🍌",
  Pera: "🍐",
  Zanahoria: "🥕",
  Naranja: "🍊",
  Fresa: "🍓",
  Melocotón: "🍑",
  Ciruela: "🫐",
  Lechuga: "🥬",
  Pepino: "🥒",
  Calabacín: "🥒",
  Berenjena: "🍆",
  Cereza: "🍒",
  Uva: "🍇",
  Sandía: "🍉",
  Melón: "🍈",
  Patata: "🥔",
  Mandarina: "🍊",
  Cebolla: "🧅",
  Calabaza: "🎃",

  // Ropa y accesorios
  Camiseta: "👕",
  Pantalón: "👖",
  Zapato: "👟",
  Abrigo: "🧥",
  Chaqueta: "🧥",
  Jersey: "🧶",
  Gorra: "🧢",
  Sombrero: "👒",
  Visera: "🧢",
  Calcetín: "🧦",
  Bufanda: "🧣",
  Pijama: "🛌",
  Camisón: "👗",

  // Transportes
  Avión: "✈️",
  Barco: "🚢",
  Bicicleta: "🚲",
  Coche: "🚗",
  Autobús: "🚌",
  Camión: "🚚",
  Tren: "🚆",
  Metro: "🚇",
  Tranvía: "🚊",
  Patinete: "🛴",

  // Colegio
  Lápiz: "✏️",
  Cuaderno: "📓",
  Regla: "📏",
  Tijeras: "✂️",
  Pegamento: "🧴",
  Cartulina: "📃",
  Pizarra: "🧑‍🏫",
  Tiza: "🖍️",
  Borrador: "🧽",
  Almuerzo: "🥪",

  // Cocina y utensilios
  Cuchara: "🥄",
  Tenedor: "🍴",
  Plato: "🍽️",
  Cuchillo: "🔪",
  Cazuela: "🍲",
  Sartén: "🍳",
  Olla: "🍲",
  Cazo: "🥣",
  Pelota: "⚽",
  Microondas: "📡",

  // Instrumentos musicales
  Guitarra: "🎸",
  Piano: "🎹",
  Tambor: "🥁",
  Violín: "🎻",
  Viola: "🎻",
  Violonchelo: "🎻",
  Cepillo: "🪥",
  Melodía: "🎶",
  Ritmo: "🥁",
  Canción: "🎵",

  // Cuerpo humano
  Mano: "✋",
  Pie: "🦶",
  Nariz: "👃",
  Ojo: "👁️",
  Oreja: "👂",
  Boca: "👄",
  Ventana: "🪟",

  // Muebles y casa
  Silla: "🪑",
  Mesa: "🪵",
  Cama: "🛏️",
  Sofá: "🛋️",
  Sillón: "🪑",
  Taburete: "🪑",
  Armario: "🚪",
  Puerta: "🚪",
  Tejado: "🏠",
  Estantería: "📚",

  // Tiempo atmosférico y naturaleza
  Sol: "☀️",
  Nube: "☁️",
  Lluvia: "🌧️",
  Nieve: "❄️",
  Granizo: "🧊",
  Llovizna: "🌦️",
  Flor: "🌸",
  Árbol: "🌳",
  Hoja: "🍃",
  Río: "🏞️",
  Lago: "🌊",
  Cascada: "💦",

  // Aseo personal y baño
  "Cepillo de dientes": "🪥",
  Jabón: "🧼",
  Toalla: "🧻",
  Champú: "🧴",
  Acondicionador: "🧴",
  Peine: "🪮",
  Lavabo: "🚰",
  Bañera: "🛁",
  Ducha: "🚿",

  // Herramientas
  Martillo: "🔨",
  Serrucho: "🪚",
  Destornillador: "🪛",
  Alicates: "🗜️",
  "Llave inglesa": "🔧",
  Taladro: "🛠️",
  Regadera: "🚿",
  Pala: "🪏",
  Rastrillo: "🧹",

  // Alimentos
  Pan: "🍞",
  Queso: "🧀",
  Huevo: "🥚",
  Arroz: "🍚",
  Pasta: "🍝",
  Lentejas: "🥣",
  Leche: "🥛",
  Tostada: "🍞",
  Cereales: "🥣",
  Yogur: "🥣",
  Galleta: "🍪",

  // Dormitorio
  Almohada: "🛏️",
  Manta: "🧣",
  Mesilla: "🛏️",
  Edredón: "🛌",
  Sábana: "🛏️",

  // Deportes y protección
  Balón: "⚽",
  Raqueta: "🏸",
  Patín: "🛼",
  "Guantes de boxeo": "🥊",
  Casco: "⛑️",
  "Protector bucal": "🥋",

  // Tecnología
  Teléfono: "📱",
  Ordenador: "💻",
  Tableta: "📲",
  Teclado: "⌨️",
  Ratón: "🖱️",
  Monitor: "🖥️",

  // Profesiones y salud
  Estetoscopio: "🩺",
  Termómetro: "🌡️",
  Vendas: "🩹",

  // Jardín y playa
  Maceta: "🪴",
  Sombrilla: "⛱️",
  Cubo: "🪣",
  "Palas de playa": "🏖️",

  // Otros objetos y conceptos
  Semáforo: "🚦",
  Zapatero: "👞",
  Escalera: "🪜",
  Círculo: "⭕",
  Triángulo: "🔺",
  Cuadrado: "🟦",
  Azul: "🔵",
  Radio: "📻",
  Televisión: "📺",
  Periódico: "📰",
  Hospital: "🏥",
  Biblioteca: "📚",
  Ayuntamiento: "🏛️",
  Alegría: "😄",
  Tristeza: "😢",
  Enfado: "😠",
  Luna: "🌙",
  Planeta: "🪐",
  Estrella: "⭐",
};



function shuffle<T>(items: T[]): T[] {
  const result: T[] = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createRound(count = 10): AlbumQuestion[] {
  const shuffledQuestions = shuffle<AlbumQuestion>(albumQuestions);

  return shuffledQuestions
    .slice(0, Math.min(count, albumQuestions.length))
    .map((question): AlbumQuestion => ({
      ...question,
      options: shuffle<string>(question.options),
    }));
}

function getIllustrationUrl(word: string): string | null {
  const emoji = illustrations[word];

  if (!emoji) return null;

  const code = Array.from(emoji)
    .filter((character) => character !== "\uFE0F")
    .map((character) =>
      character.codePointAt(0)!.toString(16).toUpperCase()
    )
    .join("-");

  return `https://openmoji.org/data/color/svg/${code}.svg`;
}

export default function AlbumGame({ onBack }: AlbumGameProps) {
  const [questions, setQuestions] = useState(() => createRound());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[questionIndex];
  const isCorrect = selected === question.correctAnswer;

  function chooseAnswer(option: string) {
    if (selected !== null) return;

    setSelected(option);

    if (option === question.correctAnswer) {
      setScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setShowHint(false);
  }

  function restartGame() {
    setQuestions(createRound());
    setQuestionIndex(0);
    setSelected(null);
    setShowHint(false);
    setScore(0);
    setFinished(false);
  }

  return (
    <main className="game-page">
      <button className="button-back" onClick={onBack}>
        ← Volver al hub
      </button>

      <header className="game-heading">
        <span className="eyebrow">🖼️ ÁLBUM DE LAS PALABRAS</span>
        <h1>¡Encuentra la intrusa!</h1>
        <p>
          Observa las imágenes, encuentra la diferente
          y descubre por qué.
        </p>
      </header>

      {finished ? (
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
            <button className="button-primary" onClick={restartGame}>
              Nueva partida
            </button>
            <button className="button-secondary" onClick={onBack}>
              Volver al hub
            </button>
          </div>
        </section>
      ) : (
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

          <span className="category-pill">{question.category}</span>
          <h2 className="question-title">{question.prompt}</h2>

          <div className="answer-grid">
            {question.options.map((option:string) => {
              const isSelected = selected === option;
              const isAnswer = option === question.correctAnswer;

              let stateClass = "";

              if (selected !== null && isAnswer) {
                stateClass = "answer-correct";
              } else if (isSelected && !isCorrect) {
                stateClass = "answer-incorrect";
              }

              const imageUrl = getIllustrationUrl(option);

              return (
                <button
                  key={option}
                  className={`answer-option ${stateClass}`}
                  onClick={() => chooseAnswer(option)}
                  disabled={selected !== null}
                  aria-pressed={isSelected}
                >
                  {imageUrl ? (
                    <img
                      className="answer-illustration"
                      src={imageUrl}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />
                  ) : (
                    <span className="answer-emoji" aria-hidden="true">
                      {illustrations[option] ?? "🖼️"}
                    </span>
                  )}
                  <span>{option}</span>
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
                💡 {showHint ? "Pista revelada" : "Necesito una pista"}
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
                {isCorrect ? "¡Muy bien! 🎉" : "¡Buen intento! 💛"}
              </h3>

              <p>{question.explanation}</p>

              {!isCorrect && (
                <p>
                  La respuesta correcta era:{" "}
                  <strong>{question.correctAnswer}</strong>.
                </p>
              )}

              <button className="button-primary" onClick={nextQuestion}>
                {questionIndex === questions.length - 1
                  ? "Ver resultado"
                  : "Siguiente pregunta →"}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}