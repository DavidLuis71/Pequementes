
import { useState } from "react";
import "./LetterPairsGame.css";

type LetterPairsGameProps = {
  onBack: () => void;
};

type LetterTile = {
  letter: string;
  pair: string;
};

const ALPHABET = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I",
  "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q",
  "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

function shuffle<T,>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}


function createTiles(target: string, tileCount: number): LetterTile[] {
  const targetTiles: LetterTile[] = [
    { letter: target, pair: target },
    { letter: target.toLowerCase(), pair: target },
  ];

  const distractorCount = tileCount - 2;
  const uppercaseCount = distractorCount / 2;

  const distractorLetters = shuffle(
    ALPHABET.filter((letter) => letter !== target)
  ).slice(0, distractorCount);

  const distractors: LetterTile[] = distractorLetters.map(
    (letter, index) => {
      const uppercase = index < uppercaseCount;

      return {
        letter: uppercase ? letter : letter.toLowerCase(),
        pair: letter,
      };
    }
  );

  return shuffle([...targetTiles, ...distractors]);
}


export default function LetterPairsGame({
  onBack,
}: LetterPairsGameProps) {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([
    "A",
    "M",
    "S",
  ]);

  const [showSetup, setShowSetup] = useState(true);
  const [roundIndex, setRoundIndex] = useState(0);
const [tiles, setTiles] = useState<LetterTile[]>(() =>
  createTiles("A", 8)
);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  
const [tileCount, setTileCount] = useState(8);
const [letterStyle, setLetterStyle] = useState<"school" | "default">(
  "school"
);

const [roundLetters, setRoundLetters] = useState<string[]>([
  "A",
  "M",
  "S",
]);


  const currentTarget = roundLetters[roundIndex];
  const roundComplete = matchedPairs.length === 1;

  function isUppercase(letter: string) {
    return letter === letter.toUpperCase();
  }

  function isMatched(letter: string) {
    return matchedPairs.includes(letter.toUpperCase());
  }

  function toggleLetter(letter: string) {
    setSelectedLetters((previous) =>
      previous.includes(letter)
        ? previous.filter((item) => item !== letter)
        : [...previous, letter].sort(
            (a, b) => ALPHABET.indexOf(a) - ALPHABET.indexOf(b)
          )
    );
  }


function startGame() {
  if (selectedLetters.length === 0) return;

  const randomizedLetters = shuffle(selectedLetters);

  setRoundLetters(randomizedLetters);
  setRoundIndex(0);
  setTiles(createTiles(randomizedLetters[0], tileCount));
  setMatchedPairs([]);
  setSelectedLetter(null);
  setShowHint(false);
  setFinished(false);
  setDraggedLetter(null);
  setFeedback("Busca la mayúscula y su minúscula.");
  setShowSetup(false);
}


  function tryMatch(first: string, second: string) {
    if (first === second) {
      setSelectedLetter(null);
      return;
    }

    const firstIsUpper = isUppercase(first);
    const secondIsUpper = isUppercase(second);

    const upper = firstIsUpper ? first : second;
    const lower = firstIsUpper ? second : first;

    const isCorrect =
      firstIsUpper !== secondIsUpper &&
      upper.toLowerCase() === lower;

    if (isCorrect && upper.toUpperCase() === currentTarget) {
      setMatchedPairs([currentTarget]);
      setFeedback(`¡Muy bien! ${upper} y ${lower} son pareja. ✨`);
      setSelectedLetter(null);
      setShowHint(false);
    } else {
      setFeedback("¡Buen intento! Sigue buscando la pareja. 💪");
      setSelectedLetter(null);
    }
  }

  function handleTileClick(letter: string) {
    if (finished || roundComplete || isMatched(letter)) return;

    if (selectedLetter === null) {
      setSelectedLetter(letter);
      setFeedback(`Has elegido la ${letter}. ¡Busca su pareja!`);
      return;
    }

    if (selectedLetter === letter) {
      setSelectedLetter(null);
      setFeedback("Elige otra letra cuando quieras.");
      return;
    }

    tryMatch(selectedLetter, letter);
  }

  function handleDrop(targetLetter: string) {
    if (!draggedLetter || draggedLetter === targetLetter) return;
    if (isMatched(draggedLetter) || isMatched(targetLetter)) return;

    tryMatch(draggedLetter, targetLetter);
    setDraggedLetter(null);
  }


function showNextRound() {
  if (!roundComplete) return;

  if (roundIndex >= roundLetters.length - 1) {
    setFinished(true);
    return;
  }

  const nextIndex = roundIndex + 1;

  setRoundIndex(nextIndex);
  setTiles(createTiles(roundLetters[nextIndex], tileCount));
  setMatchedPairs([]);
  setSelectedLetter(null);
  setShowHint(false);
  setDraggedLetter(null);
  setFeedback("¡Nueva pareja! Vamos a encontrarla.");
}


  function toggleHint() {
    const nextValue = !showHint;
    setShowHint(nextValue);
    setSelectedLetter(null);
    setFeedback(
      nextValue
        ? "¡Fíjate en las tarjetas resaltadas!"
        : "¡Sigue buscando la pareja!"
    );
  }

  function backToSetup() {
    setShowSetup(true);
    setFinished(false);
    setMatchedPairs([]);
    setSelectedLetter(null);
    setShowHint(false);
    setDraggedLetter(null);
  }

  // CONFIGURACIÓN PARA LA PROFESORA
  if (showSetup) {
    return (
      <main
  className={`game-page pairs-game ${
    letterStyle === "school" ? "pairs-font-school" : "pairs-font-default"
  }`}
>
        <button className="button-back" onClick={onBack}>
          ← Volver a los juegos
        </button>

        <header className="pairs-header">
          <div className="pairs-logo" aria-hidden="true">🏭</div>
          <span className="pairs-eyebrow">LA FÁBRICA DE PAREJAS</span>
          <h1>Preparamos las letras</h1>
          <p>
            Elige las letras que quieres trabajar. El niño encontrará
            una pareja cada vez.
          </p>
        </header>

        <section className="pairs-panel pairs-setup">
          <div className="pairs-setup-heading">
            <h2>¿Qué letras vamos a practicar?</h2>
            <p>
              Seleccionadas: <strong>{selectedLetters.length}</strong>
            </p>
          </div>

          <div className="pairs-letter-picker">
            {ALPHABET.map((letter) => {
              const active = selectedLetters.includes(letter);

              return (
                <button
                  key={letter}
                  type="button"
                  className={`pairs-picker-letter ${active ? "is-active" : ""}`}
                  onClick={() => toggleLetter(letter)}
                  aria-pressed={active}
                  aria-label={`${letter}, ${active ? "seleccionada" : "no seleccionada"}`}
                >
                  {letter}
                  {active && <span aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="pairs-settings-row">
<div className="pairs-count-setting">
  <label htmlFor="pairs-tile-count">
    ¿Cuántas tarjetas aparecerán?
  </label>

  <select
    id="pairs-tile-count"
    value={tileCount}
    onChange={(event) => setTileCount(Number(event.target.value))}
  >
    <option value={4}>4 tarjetas</option>
    <option value={6}>6 tarjetas</option>
    <option value={8}>8 tarjetas</option>
    <option value={10}>10 tarjetas</option>
    <option value={12}>12 tarjetas</option>
  </select>

  <p>
    Siempre habrá una sola pareja correcta y las demás tarjetas
    serán distractores.
  </p>
</div>


<div className="pairs-font-setting">
  <label htmlFor="pairs-letter-style">
    ¿Qué tipo de letra quieres utilizar?
  </label>

  <select
    id="pairs-letter-style"
    value={letterStyle}
    onChange={(event) =>
      setLetterStyle(event.target.value as "school" | "default")
    }
  >
    <option value="school">Letra escolar</option>
    <option value="default">Letra predeterminada</option>
  </select>

  <p>
    Puedes cambiar el estilo de las letras del tablero cuando quieras,
    antes de empezar la partida.
  </p>
</div>
</div>

          <div className="pairs-setup-summary">
            <span aria-hidden="true">🎯</span>
            <div>
              <strong>Una pareja por turno</strong>
<p>
  Aparecerán {tileCount} tarjetas: una pareja correcta y{" "}
  {tileCount - 2} distractores, repartidos entre mayúsculas y
  minúsculas.
</p>
            </div>
          </div>

          <div className="pairs-actions">
            <button
              className="button-primary"
              onClick={startGame}
              disabled={selectedLetters.length === 0}
            >
              ¡Empezar! →
            </button>
            <button
              className="button-secondary"
              onClick={() => setSelectedLetters([...ALPHABET])}
            >
              Seleccionar todas
            </button>
            <button
              className="button-secondary"
              onClick={() => setSelectedLetters([])}
            >
              Borrar selección
            </button>
          </div>

          {selectedLetters.length === 0 && (
            <p className="pairs-setup-warning" role="alert">
              Selecciona al menos una letra para empezar.
            </p>
          )}
        </section>
      </main>
    );
  }

  // FINAL DEL JUEGO
  if (finished) {
    return (
      <main
  className={`game-page pairs-game ${
    letterStyle === "school" ? "pairs-font-school" : "pairs-font-default"
  }`}
>
        <button className="button-back" onClick={onBack}>
          ← Volver a los juegos
        </button>

        <section className="pairs-finish">
          <div className="pairs-finish-emoji" aria-hidden="true">
            🏭✨🎉
          </div>
          <span className="pairs-eyebrow">¡MISIÓN CUMPLIDA!</span>
          <h1>¡Fábrica completada!</h1>
          <p>
            ¡Has encontrado todas las parejas que preparó tu profesora!
          </p>

          <div className="pairs-finish-letters">
            {selectedLetters.map((letter) => (
              <span key={letter}>
                {letter} {letter.toLowerCase()}
              </span>
            ))}
          </div>

          <div className="pairs-actions">
            <button className="button-primary" onClick={startGame}>
              Jugar otra vez ↻
            </button>
            <button className="button-secondary" onClick={backToSetup}>
              Cambiar las letras
            </button>
            <button className="button-secondary" onClick={onBack}>
              Volver al menú
            </button>
          </div>
        </section>
      </main>
    );
  }

  // JUEGO
  return (
    <main
  className={`game-page pairs-game ${
    letterStyle === "school" ? "pairs-font-school" : "pairs-font-default"
  }`}
>
      <button className="button-back" onClick={backToSetup}>
        ← Cambiar las letras
      </button>

      <header className="pairs-header">
        <div className="pairs-logo" aria-hidden="true">🏭</div>
        <span className="pairs-eyebrow">LA FÁBRICA DE PAREJAS</span>
        <h1>¡Encuentra su gemela!</h1>
        <p>
          Busca la mayúscula y su minúscula. Toca dos tarjetas
          o arrastra una sobre otra.
        </p>
      </header>

      <section className="pairs-panel">
        <div className="pairs-status">
          <span>
            Reto {roundIndex + 1} de {selectedLetters.length}
          </span>
          <span>
            {roundComplete ? "¡Pareja encontrada!" : "1 pareja por encontrar"}
          </span>
        </div>

        <div
          className="pairs-progress"
          role="progressbar"
          aria-label="Retos completados"
          aria-valuemin={0}
          aria-valuemax={selectedLetters.length}
          aria-valuenow={roundIndex + (roundComplete ? 1 : 0)}
        >
          <div
            className="pairs-progress-fill"
            style={{
              width: `${
                ((roundIndex + (roundComplete ? 1 : 0)) /
                  selectedLetters.length) *
                100
              }%`,
            }}
          />
        </div>

        <div className="pairs-machine">
          <span aria-hidden="true">⚙️</span>
          <span>Busca la pareja de la letra</span>
          <span aria-hidden="true">✨</span>
        </div>

        <div className="pairs-board" aria-label={`Tablero de ${tileCount} tarjetas`}>
          {tiles.map((tile, index) => {
            const matched = isMatched(tile.letter);
            const selected = selectedLetter === tile.letter;
            const hinted =
              showHint && tile.pair === currentTarget;

            return (
              <button
                key={`${tile.letter}-${index}`}
                type="button"
                className={[
                  "pairs-tile",
                  isUppercase(tile.letter)
                    ? "pairs-uppercase"
                    : "pairs-lowercase",
                  selected ? "pairs-selected" : "",
                  matched ? "pairs-matched" : "",
                  hinted ? "pairs-hinted" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => handleTileClick(tile.letter)}
                draggable={!matched && !roundComplete}
                onDragStart={() => setDraggedLetter(tile.letter)}
                onDragEnd={() => setDraggedLetter(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(tile.letter)}
                disabled={matched || roundComplete}
                aria-pressed={selected}
                aria-label={`Letra ${tile.letter}${matched ? ", pareja encontrada" : ""}`}
              >
                <span className="pairs-tile-letter">{tile.letter}</span>
                {matched && (
                  <span className="pairs-check" aria-label="Encontrada">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pairs-feedback" aria-live="polite">
          {roundComplete ? (
            <>
              <span aria-hidden="true">🎉</span>
              <strong>¡Pareja encontrada!</strong>
              <p>¡Buen trabajo! Vamos con el siguiente reto.</p>
              <button className="button-primary" onClick={showNextRound}>
                {roundIndex === selectedLetters.length - 1
                  ? "Terminar aventura ✨"
                  : "Siguiente pareja →"}
              </button>
            </>
          ) : (
            <>
              <p>{feedback || "¡Busca las letras que van juntas!"}</p>
              <button
                type="button"
                className="button-secondary pairs-hint-button"
                onClick={toggleHint}
              >
                {showHint ? "Ocultar pista" : "Necesito una pista 💡"}
              </button>
            </>
          )}
        </div>
      </section>

      <footer className="pairs-footer">
        <span>💛 Aquí podemos equivocarnos y volver a probar.</span>
      </footer>
    </main>
  );
}
