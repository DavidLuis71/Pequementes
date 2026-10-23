import { useRef, useState } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import { getDominoOptions } from "../album/emojiGameService";
import {
  generateDominoTiles,
  shuffle,
  type Difficulty,
} from "./syllableDominoData";
import "./SyllableDominoGame.css";

type DominoTile = {
  id: string;
  image: string;
  word: string;
  syllable: string;
  placed: boolean;
  x: number;
  y: number;
  rotation: number;
};

type SyllableDominoGameProps = {
  onBack: () => void;
};

type DragPosition = {
  id: string;
  pointerId: number;
  x: number;
  y: number;
};

type HalfKind = "picture" | "syllable";
type Side = "top" | "right" | "bottom" | "left";
type ConnectionStatus = "match" | "mismatch" | "none";

type HalfGeometry = {
  kind: HalfKind;
  x: number;
  y: number;
  width: number;
  height: number;
  word: string;
  syllable: string;
};

type Position = {
  x: number;
  y: number;
};

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function matchesWordSyllable(
  pictureTile: DominoTile,
  syllableTile: DominoTile,
): boolean {
  return normalizeText(pictureTile.word).startsWith(
    normalizeText(syllableTile.syllable),
  );
}

function getTileDimensions() {
  const smallScreen = window.innerWidth <= 650;

  return {
    width:
      window.innerWidth <= 380
        ? 140
        : smallScreen
          ? 156
          : 176,
    height: smallScreen ? 76 : 82,
  };
}

function rotatePoint(
  x: number,
  y: number,
  rotation: number,
): Position {
  switch (((rotation % 360) + 360) % 360) {
    case 90:
      return { x: -y, y: x };
    case 180:
      return { x: -x, y: -y };
    case 270:
      return { x: y, y: -x };
    default:
      return { x, y };
  }
}

function getHalfGeometry(
  tile: DominoTile,
  kind: HalfKind,
  boardWidth: number,
  boardHeight: number,
): HalfGeometry {
  const dimensions = getTileDimensions();
  const rotation = ((tile.rotation % 360) + 360) % 360;
  const vertical = rotation === 90 || rotation === 270;

  const centerX = (tile.x / 100) * boardWidth;
  const centerY = (tile.y / 100) * boardHeight;

  const localX =
    kind === "picture"
      ? -dimensions.width / 4
      : dimensions.width / 4;

  const offset = rotatePoint(localX, 0, rotation);

  return {
    kind,
    x: centerX + offset.x,
    y: centerY + offset.y,
    width: vertical
      ? dimensions.height
      : dimensions.width / 2,
    height: vertical
      ? dimensions.width / 2
      : dimensions.height,
    word: tile.word,
    syllable: tile.syllable,
  };
}

function getHalves(
  tile: DominoTile,
  width: number,
  height: number,
) {
  return [
    getHalfGeometry(tile, "picture", width, height),
    getHalfGeometry(tile, "syllable", width, height),
  ];
}

function getTileSize(rotation: number) {
  const dimensions = getTileDimensions();
  const vertical = rotation % 180 !== 0;

  return {
    width: vertical ? dimensions.height : dimensions.width,
    height: vertical ? dimensions.width : dimensions.height,
  };
}

function getSideOffset(
  side: Side,
  distanceX: number,
  distanceY: number,
): Position {
  switch (side) {
    case "top":
      return { x: 0, y: -distanceY };
    case "right":
      return { x: distanceX, y: 0 };
    case "bottom":
      return { x: 0, y: distanceY };
    case "left":
      return { x: -distanceX, y: 0 };
  }
}

function getConnectionStatus(
  tile: DominoTile,
  tiles: DominoTile[],
  boardWidth: number,
  boardHeight: number,
): ConnectionStatus {
  if (!tile.placed) return "none";

  const gap = 8;
  let hasConnection = false;
  let hasMismatch = false;

  const currentHalves = getHalves(
    tile,
    boardWidth,
    boardHeight,
  );

  for (const other of tiles) {
    if (!other.placed || other.id === tile.id) continue;

    const otherHalves = getHalves(
      other,
      boardWidth,
      boardHeight,
    );

    for (const a of currentHalves) {
      for (const b of otherHalves) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);

        const horizontalContact =
          Math.abs(
            dx - (a.width + b.width) / 2 - gap,
          ) <= 3 &&
          dy < (a.height + b.height) / 2 - 2;

        const verticalContact =
          Math.abs(
            dy - (a.height + b.height) / 2 - gap,
          ) <= 3 &&
          dx < (a.width + b.width) / 2 - 2;

        if (!horizontalContact && !verticalContact) {
          continue;
        }

        hasConnection = true;

        const correct =
          a.kind === "picture" &&
          b.kind === "syllable"
            ? matchesWordSyllable(tile, other)
            : a.kind === "syllable" &&
                b.kind === "picture"
              ? matchesWordSyllable(other, tile)
              : false;

        if (!correct) hasMismatch = true;
      }
    }
  }

  if (!hasConnection) return "none";
  return hasMismatch ? "mismatch" : "match";
}

export default function SyllableDominoGame({
  onBack,
}: SyllableDominoGameProps) {
  const [tiles, setTiles] = useState<DominoTile[]>([]);
  const [showConfig, setShowConfig] = useState(true);
  const [difficulty, setDifficulty] =
    useState<Difficulty>("facil");
  const [tileCount, setTileCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState("");

  const previousSignatureRef = useRef("");
  const boardRef = useRef<HTMLDivElement>(null);

  // Genera una partida usando el catálogo compartido de emojis.
  // Las sílabas se mezclan por separado de las imágenes.
  const startGame = async () => {
    if (loading) return;

    setLoading(true);
    setConfigError("");

    try {
      const options = await getDominoOptions();

      const generated = generateDominoTiles(
        options,
        difficulty,
        tileCount,
      );

      if (generated.length < 2) {
        throw new Error(
          "No hay suficientes fichas para iniciar la partida.",
        );
      }

      const shuffledSyllables = shuffle(
        generated.map((tile) => tile.syllable),
      );

      const createSignature = (items: DominoTile[]) =>
        items
          .map(
            (tile) =>
              `${normalizeText(tile.word)}:${normalizeText(tile.syllable)}`,
          )
          .sort()
          .join("|");

      let newTiles: DominoTile[] = generated.map(
        (tile, index) => ({
          ...tile,
          syllable: shuffledSyllables[index],
          placed: false,
          x: 50,
          y: 50,
          rotation: 0,
        }),
      );

      // Si la combinación completa se repite, cambiamos
      // el reparto de sílabas para intentar crear otra partida.
      if (
        newTiles.length > 1 &&
        createSignature(newTiles) === previousSignatureRef.current
      ) {
        const rotatedSyllables = [
          ...shuffledSyllables.slice(1),
          shuffledSyllables[0],
        ];

        newTiles = newTiles.map((tile, index) => ({
          ...tile,
          syllable: rotatedSyllables[index],
        }));
      }

      previousSignatureRef.current =
        createSignature(newTiles);

      setTiles(newTiles);
      setDragPosition(null);
      setShowConfig(false);
    } catch (error) {
      setConfigError(
        error instanceof Error
          ? error.message
          : "No se ha podido iniciar la partida.",
      );
    } finally {
      setLoading(false);
    }
  };

  const [dragPosition, setDragPosition] =
    useState<DragPosition | null>(null);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    id: string,
  ) => {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    event.preventDefault();

    const tile = tiles.find((item) => item.id === id);
    if (!tile) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    setDragPosition({
      id,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setDragPosition((current) => {
      if (!current || current.pointerId !== event.pointerId) {
        return current;
      }

      return {
        ...current,
        x: event.clientX,
        y: event.clientY,
      };
    });
  };

  const finishDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const drag = dragPosition;

    if (!drag || drag.pointerId !== event.pointerId) return;

    const rect = boardRef.current?.getBoundingClientRect();

    if (
      rect &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      const movingTile = tiles.find(
        (tile) => tile.id === drag.id,
      );

      if (!movingTile) {
        setDragPosition(null);
        return;
      }

      const dimensions = getTileDimensions();
      const size = getTileSize(movingTile.rotation);
      const gap = 8;

      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      const placedTiles = tiles.filter(
        (tile) => tile.placed && tile.id !== drag.id,
      );

      const candidates: Position[] = [];

      if (placedTiles.length === 0) {
        candidates.push({
          x: Math.max(
            size.width / 2,
            Math.min(
              rect.width - size.width / 2,
              pointerX,
            ),
          ),
          y: Math.max(
            size.height / 2,
            Math.min(
              rect.height - size.height / 2,
              pointerY,
            ),
          ),
        });
      } else {
        const movingHalves = getHalves(
          { ...movingTile, x: 50, y: 50 },
          rect.width,
          rect.height,
        );

        const sides: Side[] = [
          "top",
          "right",
          "bottom",
          "left",
        ];

        for (const other of placedTiles) {
          const otherHalves = getHalves(
            other,
            rect.width,
            rect.height,
          );

          for (const movingHalf of movingHalves) {
            for (const otherHalf of otherHalves) {
              for (const side of sides) {
                const offset = getSideOffset(
                  side,
                  (otherHalf.width + movingHalf.width) / 2 +
                    gap,
                  (otherHalf.height + movingHalf.height) / 2 +
                    gap,
                );

                const desiredHalfX = otherHalf.x + offset.x;
                const desiredHalfY = otherHalf.y + offset.y;

                const relativeOffset = rotatePoint(
                  movingHalf.kind === "picture"
                    ? -dimensions.width / 4
                    : dimensions.width / 4,
                  0,
                  movingTile.rotation,
                );

                candidates.push({
                  x: desiredHalfX - relativeOffset.x,
                  y: desiredHalfY - relativeOffset.y,
                });
              }
            }
          }
        }
      }

      const validCandidates = candidates.filter(
        (candidate) => {
          if (
            candidate.x < size.width / 2 ||
            candidate.x > rect.width - size.width / 2 ||
            candidate.y < size.height / 2 ||
            candidate.y > rect.height - size.height / 2
          ) {
            return false;
          }

          return placedTiles.every((other) => {
            const otherSize = getTileSize(other.rotation);
            const otherX = (other.x / 100) * rect.width;
            const otherY = (other.y / 100) * rect.height;

            return (
              Math.abs(candidate.x - otherX) >=
                (size.width + otherSize.width) / 2 +
                  gap -
                  1 ||
              Math.abs(candidate.y - otherY) >=
                (size.height + otherSize.height) / 2 +
                  gap -
                  1
            );
          });
        },
      );

      validCandidates.sort((a, b) => {
        const distanceA = Math.hypot(
          a.x - pointerX,
          a.y - pointerY,
        );

        const distanceB = Math.hypot(
          b.x - pointerX,
          b.y - pointerY,
        );

        return distanceA - distanceB;
      });

      const position = validCandidates[0];

      if (position) {
        setTiles((currentTiles) =>
          currentTiles.map((tile) =>
            tile.id === drag.id
              ? {
                  ...tile,
                  placed: true,
                  x: (position.x / rect.width) * 100,
                  y: (position.y / rect.height) * 100,
                }
              : tile,
          ),
        );
      }
    }

    setDragPosition(null);
  };

  const cancelDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setDragPosition((current) =>
      current?.pointerId === event.pointerId ? null : current,
    );
  };

  const rotateTile = (id: string) => {
    setTiles((currentTiles) =>
      currentTiles.map((tile) =>
        tile.id === id
          ? {
              ...tile,
              rotation: (tile.rotation + 90) % 360,
            }
          : tile,
      ),
    );
  };

  const resetGame = () => {
    void startGame();
  };

  const placedCount = tiles.filter(
    (tile) => tile.placed,
  ).length;

  const draggedTile = dragPosition
    ? tiles.find((tile) => tile.id === dragPosition.id)
    : undefined;

  const boardRect = boardRef.current?.getBoundingClientRect();
  const boardWidth = boardRect?.width ?? 800;
  const boardHeight = boardRect?.height ?? 450;

  const getTileStyle = (
    tile: DominoTile,
  ): CSSProperties =>
    ({
      left: `${tile.x}%`,
      top: `${tile.y}%`,
      "--rotation": `${tile.rotation}deg`,
      "--counter-rotation": `${-tile.rotation}deg`,
    }) as CSSProperties;

  const getDragStyle = (
    tile: DominoTile,
  ): CSSProperties =>
    ({
      left: `${dragPosition?.x ?? 0}px`,
      top: `${dragPosition?.y ?? 0}px`,
      "--rotation": `${tile.rotation}deg`,
      "--counter-rotation": `${-tile.rotation}deg`,
    }) as CSSProperties;

  const getStatusClass = (tile: DominoTile) => {
    const status = getConnectionStatus(
      tile,
      tiles,
      boardWidth,
      boardHeight,
    );

    if (status === "match") {
      return "syllable-domino__tile--match";
    }

    if (status === "mismatch") {
      return "syllable-domino__tile--mismatch";
    }

    return "";
  };

  const renderTileContents = (tile: DominoTile) => (
    <>
      <div className="syllable-domino__half syllable-domino__picture">
        <span className="syllable-domino__emoji">
          {tile.image}
        </span>
        <span className="syllable-domino__word">
          {tile.word}
        </span>
      </div>

      <div className="syllable-domino__divider" />

      <div className="syllable-domino__half syllable-domino__syllable">
        <span className="syllable-domino__syllable-text">
          {tile.syllable}
        </span>
      </div>
    </>
  );

  return (
    <main className="syllable-domino">
      <button
        className="syllable-domino__back"
        onClick={onBack}
        type="button"
      >
        ← Volver a los juegos
      </button>

      {showConfig ? (
        <section className="syllable-domino__config">
          <span className="syllable-domino__eyebrow">
            CONFIGURACIÓN DEL PROFESOR
          </span>

          <h1>El dominó de las sílabas</h1>
          <p>
            Elige el nivel y el número de fichas para preparar
            una nueva partida.
          </p>

          <div className="syllable-domino__config-field">
            <label htmlFor="domino-difficulty">
              Nivel de dificultad
            </label>

            <select
              id="domino-difficulty"
              value={difficulty}
              disabled={loading}
              onChange={(event) =>
                setDifficulty(
                  event.target.value as Difficulty,
                )
              }
            >
              <option value="facil">
                Fácil: sílabas directas (MA, PE, LU...)
              </option>
              <option value="intermedia">
                Intermedio: directas e inversas (MA, AL, EN...)
              </option>
              <option value="dificil">
                Difícil: directas, inversas y trabadas (BRA, TRE...)
              </option>
            </select>
          </div>

          <div className="syllable-domino__config-field">
            <label htmlFor="domino-tile-count">
              Número de fichas
            </label>

            <select
              id="domino-tile-count"
              value={tileCount}
              disabled={loading}
              onChange={(event) =>
                setTileCount(Number(event.target.value))
              }
            >
              <option value={6}>6 fichas</option>
              <option value={8}>8 fichas</option>
              <option value={12}>12 fichas</option>
              <option value={16}>16 fichas</option>
              <option value={20}>20 fichas</option>
            </select>
          </div>

          {configError && (
            <p
              className="syllable-domino__config-error"
              role="alert"
            >
              {configError}
            </p>
          )}

          <button
            className="syllable-domino__reset"
            type="button"
            onClick={() => void startGame()}
            disabled={loading}
          >
            {loading
              ? "Preparando fichas..."
              : "▶ Empezar a jugar"}
          </button>
        </section>
      ) : (
        <>
          <header className="syllable-domino__header">
            <div>
              <span className="syllable-domino__eyebrow">
                JUEGO DE LECTOESCRITURA
              </span>
              <h1>El dominó de las sílabas</h1>
              <p>
                Mueve las fichas con el dedo o el ratón y gíralas
                para colocarlas como quieras.
              </p>
              <p>
                Nivel:{" "}
                <strong>
                  {difficulty === "facil"
                    ? "Fácil"
                    : difficulty === "intermedia"
                      ? "Intermedio"
                      : "Difícil"}
                </strong>
              </p>
            </div>

            <div className="syllable-domino__header-actions">
              <button
                className="syllable-domino__reset"
                onClick={resetGame}
                type="button"
                disabled={loading}
              >
                ↻ Nueva partida
              </button>

              <button
                className="syllable-domino__reset"
                onClick={() => setShowConfig(true)}
                type="button"
              >
                ⚙ Configuración
              </button>
            </div>
          </header>

          {configError && (
            <p role="alert" className="syllable-domino__config-error">
              {configError}
            </p>
          )}

          <section className="syllable-domino__board-section">
            <div className="syllable-domino__board-heading">
              <h2>Mi tablero</h2>
              <span>
                {placedCount} de {tiles.length} fichas colocadas
              </span>
            </div>

            <div
              ref={boardRef}
              className="syllable-domino__board"
              aria-label="Tablero para colocar las fichas de dominó"
            >
              <div className="syllable-domino__board-message">
                Mueve las fichas hasta aquí
              </div>

              {tiles
                .filter((tile) => tile.placed)
                .map((tile) => (
                  <div
                    className={`syllable-domino__tile syllable-domino__tile--placed ${getStatusClass(tile)}`}
                    key={tile.id}
                    style={{
                      ...getTileStyle(tile),
                      opacity:
                        dragPosition?.id === tile.id ? 0 : 1,
                    }}
                    onPointerDown={(event) =>
                      handlePointerDown(event, tile.id)
                    }
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishDrag}
                    onPointerCancel={cancelDrag}
                    aria-label={`Ficha ${tile.word}, sílaba ${tile.syllable}`}
                  >
                    {renderTileContents(tile)}

                    <button
                      className="syllable-domino__rotate"
                      type="button"
                      title="Girar ficha 90 grados"
                      aria-label={`Girar ficha ${tile.word}`}
                      onPointerDown={(event) =>
                        event.stopPropagation()
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        rotateTile(tile.id);
                      }}
                    >
                      ↻
                    </button>
                  </div>
                ))}
            </div>
          </section>

          <section className="syllable-domino__tray-section">
            <div className="syllable-domino__tray-heading">
              <div>
                <h2>Mis fichas</h2>
                <p>
                  Toca y mueve una ficha hasta el tablero.
                </p>
              </div>
              <span>
                {tiles.length - placedCount} disponibles
              </span>
            </div>

            <div className="syllable-domino__tray">
              {tiles
                .filter((tile) => !tile.placed)
                .map((tile) => (
                  <div
                    className="syllable-domino__tile syllable-domino__tile--tray"
                    key={tile.id}
                    style={{
                      opacity:
                        dragPosition?.id === tile.id ? 0 : 1,
                    }}
                    onPointerDown={(event) =>
                      handlePointerDown(event, tile.id)
                    }
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishDrag}
                    onPointerCancel={cancelDrag}
                    aria-label={`Ficha ${tile.word}, sílaba ${tile.syllable}`}
                  >
                    {renderTileContents(tile)}
                  </div>
                ))}
            </div>
          </section>

          {draggedTile && dragPosition && (
            <div
              className="syllable-domino__drag-preview syllable-domino__tile"
              style={getDragStyle(draggedTile)}
              aria-hidden="true"
            >
              {renderTileContents(draggedTile)}
            </div>
          )}

          <p className="syllable-domino__tip">
            💡 Pulsa ↻ para girar una ficha 90°. Las uniones
            verdes son correctas y las rojas indican que la
            sílaba no coincide con la palabra.
          </p>
        </>
      )}
    </main>
  );
}
