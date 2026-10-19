
import type { GameInfo } from "../data/games";

type GameCardProps = {
  game: GameInfo;
  onPlay: (gameId: string) => void;
};

export default function GameCard({
  game,
  onPlay,
}: GameCardProps) {
  return (
    <article
      className="game-card"
      style={{ "--game-color": game.color } as React.CSSProperties}
    >
      <div className="game-card-art" aria-hidden="true">
        <span>{game.emoji}</span>
      </div>

      <div className="game-card-content">
        <span className="game-category">{game.category}</span>
        <h2>{game.title}</h2>
        <p>{game.description}</p>

        <button
          className="button-primary"
          disabled={!game.available}
          onClick={() => onPlay(game.id)}
        >
          {game.available ? "¡Jugar! →" : "Próximamente"}
        </button>
      </div>
    </article>
  );
}