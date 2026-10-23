import { useEffect, useMemo, useState } from "react";
import "./StoriesGame.css";
import { storiesData, type Story } from "./storiesData";

type StoriesGameProps = {
  onBack: () => void;
};

type SceneImageProps = {
  emoji: string;
  description: string;
};

function SceneImage({ emoji, description }: SceneImageProps) {
  return (
    <div
      className="scene-visual scene-visual-emoji-only"
      role="img"
      aria-label={description}
    >
      <span className="scene-visual-emoji" aria-hidden="true">
        {emoji}
      </span>
    </div>
  );
}

function shuffleScenes<T,>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function StoriesGame({ onBack }: StoriesGameProps) {
  const [level, setLevel] = useState(1);
  const [storyId, setStoryId] = useState("");
  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const levelStories = useMemo(
    () => storiesData.filter((story) => story.level === level),
    [level]
  );

  const selectedStory: Story | undefined =
    levelStories.find((story) => story.id === storyId) ?? levelStories[0];

  function resetStory(story: Story) {
    setStoryId(story.id);
    setShuffledIds(shuffleScenes(story.scenes).map((scene) => scene.id));
    setPlacedIds([]);
    setChecked(false);
    setFeedback("");
  }

  useEffect(() => {
    const firstStory = storiesData.find((story) => story.level === level);

    if (firstStory) {
      setStoryId(firstStory.id);
      setShuffledIds(
        shuffleScenes(firstStory.scenes).map((scene) => scene.id)
      );
      setPlacedIds([]);
      setChecked(false);
      setFeedback("");
    }
  }, [level]);

  const availableScenes = useMemo(() => {
    if (!selectedStory) return [];

    return shuffledIds
      .filter((id) => !placedIds.includes(id))
      .map((id) => selectedStory.scenes.find((scene) => scene.id === id))
      .filter((scene) => scene !== undefined);
  }, [selectedStory, shuffledIds, placedIds]);

  const placedScenes = useMemo(() => {
    if (!selectedStory) return [];

    return placedIds
      .map((id) => selectedStory.scenes.find((scene) => scene.id === id))
      .filter((scene) => scene !== undefined);
  }, [selectedStory, placedIds]);

  const correctOrder = useMemo(
    () => selectedStory?.scenes.map((scene) => scene.id) ?? [],
    [selectedStory]
  );

  const isCorrect =
    placedIds.length === correctOrder.length &&
    placedIds.every((id, index) => id === correctOrder[index]);


function placeScene(sceneId: string) {
  if (checked && isCorrect) return;

  setChecked(false);

  setPlacedIds((previous) => {
    if (previous.includes(sceneId)) {
      return previous.filter((id) => id !== sceneId);
    }

    return [...previous, sceneId];
  });

  setFeedback("");
}


  function chooseStory(story: Story) {
    resetStory(story);
  }

  function shuffleCurrentStory() {
    if (!selectedStory) return;

    setShuffledIds(
      shuffleScenes(selectedStory.scenes).map((scene) => scene.id)
    );
    setPlacedIds([]);
    setChecked(false);
    setFeedback("");
  }

  function checkOrder() {
    if (!selectedStory) return;

    if (placedIds.length !== correctOrder.length) {
      setChecked(false);
      setFeedback(
        `¡Te faltan ${correctOrder.length - placedIds.length} imágenes por colocar!`
      );
      return;
    }

    setChecked(true);

    if (isCorrect) {
      setFeedback(selectedStory.ending);
      setCompletedStories((previous) =>
        previous.includes(selectedStory.id)
          ? previous
          : [...previous, selectedStory.id]
      );
    } else {
      setFeedback(
        "¡Casi! Piensa qué sucede primero, qué ocurre después y cómo termina. Puedes volver a tocar las imágenes para cambiarlas."
      );
    }
  }

  function nextStory() {
    if (!levelStories.length) return;

    const currentIndex = levelStories.findIndex(
      (story) => story.id === selectedStory?.id
    );

    const next = levelStories[(currentIndex + 1) % levelStories.length];
    chooseStory(next);
  }

  if (!selectedStory) {
    return (
      <main className="stories-game">
        <div className="stories-empty">
          No hay historias disponibles para este nivel.
        </div>
      </main>
    );
  }

  const completedInLevel = levelStories.filter((story) =>
    completedStories.includes(story.id)
  ).length;

  return (
    <main className="stories-game">
         <button
      type="button"
      className="button button-secondary"
      onClick={onBack}
    >
      ← Volver al menú
    </button>
      <header className="stories-header">
        <div className="stories-header-copy">
          <span className="stories-eyebrow">
            PEQUEMENTES · APRENDEMOS JUGANDO
          </span>
          <h1>¡Pon la historia en orden!</h1>
          <p>
            Toca las imágenes en el orden en que suceden las cosas.
            ¡Construye tu propia historia!
          </p>
        </div>

        <div className="stories-mascot" aria-hidden="true">
          <span>📚</span>
          <span className="stories-sparkle">✨</span>
        </div>
      </header>

      <section className="level-panel" aria-label="Seleccionar dificultad">
        <div className="level-panel-heading">
          <div>
            <h2>Elige tu nivel</h2>
            <p>¡Cada nivel es una nueva aventura!</p>
          </div>

          <div className="level-progress">
            <span className="level-progress-number">
              {completedStories.length}/{storiesData.length}
            </span>
            <span>historias completadas</span>
          </div>
        </div>

        <div className="level-buttons">
          {[1, 2, 3].map((levelNumber) => {
            const counts = storiesData.filter(
              (story) => story.level === levelNumber
            ).length;

            const labels: Record<number, string> = {
              1: "Explorador",
              2: "Aventurero",
              3: "Superdetective",
            };

            const icons: Record<number, string> = {
              1: "🌱",
              2: "🚀",
              3: "🧠",
            };

            return (
              <button
                key={levelNumber}
                type="button"
                className={`level-button ${level === levelNumber ? "active" : ""}`}
                onClick={() => setLevel(levelNumber)}
                aria-pressed={level === levelNumber}
              >
                <span className="level-button-icon">{icons[levelNumber]}</span>
                <span className="level-button-copy">
                  <strong>Nivel {levelNumber}</strong>
                  <small>{labels[levelNumber]}</small>
                  <small>{counts} historias</small>
                </span>
                {level === levelNumber && (
                  <span className="level-selected-mark" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="level-progress-track" aria-label="Progreso del nivel">
          <div
            className="level-progress-fill"
            style={{
              width: `${
                levelStories.length
                  ? (completedInLevel / levelStories.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <p className="level-progress-caption">
          En este nivel: {completedInLevel} de {levelStories.length} historias
          completadas
        </p>
      </section>

      <section className="story-panel">
        <div className="story-heading">
          <div className="story-title-group">
            <span className="story-number">HISTORIA</span>
            <h2>{selectedStory.title}</h2>
            <p>{selectedStory.instruction}</p>
          </div>

          <label className="story-picker-label">
            <span>Elegir historia</span>
            <select
              value={selectedStory.id}
              onChange={(event) => {
                const story = levelStories.find(
                  (item) => item.id === event.target.value
                );
                if (story) chooseStory(story);
              }}
            >
              {levelStories.map((story) => (
                <option key={story.id} value={story.id}>
                  {story.title}
                  {completedStories.includes(story.id) ? " ✓" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="story-tip">
          <span aria-hidden="true">💡</span>
          <p>
            Toca una imagen para colocarla en el siguiente hueco. Si te
            equivocas, vuelve a tocarla para quitarla.
          </p>
        </div>

        <h3 className="placed-heading">
          Mi historia ({placedIds.length}/{selectedStory.scenes.length})
        </h3>

        <div className={`scene-grid scene-count-${selectedStory.scenes.length}`}>
          {Array.from({ length: selectedStory.scenes.length }, (_, index) => {
            const scene = placedScenes[index];

            return (
              <div
                key={scene?.id ?? `empty-${index}`}
                className={`story-slot ${scene ? "story-slot-filled" : "story-slot-empty"}`}
              >
                <div className="scene-card-top">
                  <span className="scene-position">{index + 1}</span>
                  <span className="scene-position-label">
                    {index === 0
                      ? "Principio"
                      : index === selectedStory.scenes.length - 1
                        ? "Final"
                        : `Paso ${index + 1}`}
                  </span>
                </div>

                {scene ? (
                  <button
                    type="button"
                    className="scene-image-button"
                    onClick={() => placeScene(scene.id)}
                    disabled={checked && isCorrect}
                    aria-label={`Quitar ${scene.description} de la posición ${index + 1}`}
                  >
                    <SceneImage
                      emoji={scene.emoji}
                      description={scene.description}
                    />
                    <p className="scene-description">{scene.description}</p>
                    {!checked && (
                      <span className="scene-select-hint">Toca para quitar</span>
                    )}
                  </button>
                ) : (
                  <div className="empty-slot">
                    <span aria-hidden="true">👆</span>
                    <span>Toca una imagen de abajo</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <h3 className="placed-heading">Imágenes disponibles</h3>

        <div className={`scene-grid scene-count-${availableScenes.length}`}>
          {availableScenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              className="scene-image-button scene-card-available"
              onClick={() => placeScene(scene.id)}
              disabled={checked}
            >
              <SceneImage
                emoji={scene.emoji}
                description={scene.description}
              />
              <p className="scene-description">{scene.description}</p>
              <span className="scene-select-hint">Toca para colocar</span>
            </button>
          ))}
        </div>

        {feedback && (
          <div
            className={`story-feedback ${
              checked && isCorrect
                ? "feedback-success"
                : "feedback-retry"
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="feedback-icon" aria-hidden="true">
              {checked && isCorrect ? "🎉" : "💪"}
            </span>
            <div>
              <strong>
                {checked && isCorrect
                  ? "¡Historia completada!"
                  : "¡Vamos a intentarlo!"}
              </strong>
              <p>{feedback}</p>
            </div>
          </div>
        )}

        <div className="story-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={shuffleCurrentStory}
          >
            <span aria-hidden="true">🔀</span> Mezclar escenas
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={checkOrder}
          >
            <span aria-hidden="true">✓</span> Comprobar orden
          </button>

          {checked && isCorrect && (
            <button
              type="button"
              className="button button-next"
              onClick={nextStory}
            >
              Siguiente historia <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </section>

      <footer className="stories-footer">
        <span aria-hidden="true">⭐</span>
        Cada historia que ordenas te ayuda a pensar, aprender y crecer.
        <span aria-hidden="true">⭐</span>
      </footer>
    </main>
  );
}