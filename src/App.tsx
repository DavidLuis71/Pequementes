
import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import { games } from "./data/games";
import AlbumGame from "./games/album/AlbumGame";
import LettersGame from "./games/letters/LettersGame";
import SoundsGame from "./games/sounds/SoundsGame";
import SyllablesGame from "./games/syllables/SyllablesGame";
import SoundGame from "./games/sound-quiz/SoundGame";
import StoriesGame from "./games/storiesData/StoriesGame";
import ReadingGame from "./games/reading/ReadingGame";
import LetterPairsGame from "./games/letter-pairs/LetterPairsGame";
import SyllableDominoGame from "./games/syllable-domino/SyllableDominoGame";

export default function App() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [activeGame]);

  if (activeGame === "album") {
    return <AlbumGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "letter-train") {
    return <LettersGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "sounds") {
    return <SoundsGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "factory") {
  return (
    <SyllablesGame
      onBack={() => setActiveGame(null)}
    />
  );
}
if (activeGame === "sound-quiz") {
  return <SoundGame onBack={() => setActiveGame(null)} />;
}

if (activeGame === "stories") {
  return <StoriesGame onBack={() => setActiveGame(null)} />;
}
if (activeGame === "reading") {
  return <ReadingGame onBack={() => setActiveGame(null)} />;
}
if (activeGame === "letter-pairs") {
  return <LetterPairsGame onBack={() => setActiveGame(null)} />;
}

if (activeGame === "syllable-domino") {
  return <SyllableDominoGame onBack={() => setActiveGame(null)} />;
}


  return (
    <main className="hub-page">
      <header className="hub-header">
        <div className="brand">
          <span className="brand-icon">🌈</span>
          <span>PequeMentes</span>
        </div>
        <span className="header-tag">Aprender jugando</span>
      </header>

      <section className="hero">
        <span className="eyebrow">UN UNIVERSO PARA DESCUBRIR</span>
        <h1>
          ¡Hola, explorador
          <br />
          de palabras! ✨
        </h1>
        <p>
          Juega, descubre y aprende a tu ritmo con nuestras
          aventuras de lenguaje.
        </p>
        <div className="hero-decoration" aria-hidden="true">
          ☁️ ⭐ 🌼
        </div>
      </section>

      <section className="games-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ELIGE TU AVENTURA</span>
            <h2>Nuestros juegos</h2>
          </div>
          <span className="games-count">
            {games.filter((game) => game.available).length} disponibles
          </span>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={setActiveGame}
            />
          ))}
        </div>
      </section>

      <footer className="hub-footer">
        <span>🌱 Cada pequeño paso cuenta.</span>
        <span>PequeMentes · Aprender a través del juego</span>
      </footer>
    </main>
  );
}
