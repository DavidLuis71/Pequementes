export type Difficulty = "facil" | "intermedia" | "dificil";

export type SyllableType = "directa" | "indirecta" | "trabada";

export type DominoWord = {
  word: string;
  emoji: string;
  group: string;
};

export type GeneratedDominoTile = {
  id: string;
  image: string;
  word: string;
  syllable: string;
  placed: boolean;
  x: number;
  y: number;
  rotation: number;
};

const VOWELS = ["A", "E", "I", "O", "U"];

const CONSONANTS = [
  "B", "C", "D", "F", "G", "H", "J", "L", "M",
  "N", "Ñ", "P", "R", "S", "T", "V", "Y", "Z",
];

// Sílabas inversas: vocal + consonante.
// La lista se puede ampliar según el currículo del centro.
const INDIRECTAS = [
  "AL", "EL", "IL", "OL", "UL",
  "AN", "EN", "IN", "ON", "UN",
  "AR", "ER", "IR", "OR", "UR",
  "AS", "ES", "IS", "OS", "US",
  "AM", "EM", "IM", "OM", "UM",
];

const TRABADAS = [
  "BRA", "BRE", "BRI", "BRO", "BRU",
  "BLA", "BLE", "BLI", "BLO", "BLU",
  "CRA", "CRE", "CRI", "CRO", "CRU",
  "CLA", "CLE", "CLI", "CLO", "CLU",
  "DRA", "DRE", "DRI", "DRO", "DRU",
  "FRA", "FRE", "FRI", "FRO", "FRU",
  "FLA", "FLE", "FLI", "FLO", "FLU",
  "GRA", "GRE", "GRI", "GRO", "GRU",
  "GLA", "GLE", "GLI", "GLO", "GLU",
  "PRA", "PRE", "PRI", "PRO", "PRU",
  "PLA", "PLE", "PLI", "PLO", "PLU",
  "TRA", "TRE", "TRI", "TRO", "TRU",
];

const DIRECTAS = CONSONANTS.flatMap((consonant) =>
  VOWELS.map((vowel) => `${consonant}${vowel}`)
);

export function getAllowedSyllables(
  difficulty: Difficulty,
): string[] {
  if (difficulty === "facil") {
    return DIRECTAS;
  }

  if (difficulty === "intermedia") {
    return [...DIRECTAS, ...INDIRECTAS];
  }

  return [...DIRECTAS, ...INDIRECTAS, ...TRABADAS];
}

export function normalizeWord(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function generateDominoTiles(
  words: DominoWord[],
  difficulty: Difficulty,
  count: number,
  previousSignature = "",
): GeneratedDominoTile[] {
  const allowed = getAllowedSyllables(difficulty);

  const usableWords = words.filter((item) => {
    const word = normalizeWord(item.word);

    return allowed.some((syllable) => word.startsWith(syllable));
  });

  if (usableWords.length < 2) {
    throw new Error(
      "No hay suficientes palabras para esta dificultad. " +
      "Comprueba los emojis reconocidos por la API.",
    );
  }

  // Asociamos cada palabra con una sílaba inicial válida.
  const entries = usableWords.flatMap((item) => {
    const word = normalizeWord(item.word);

    const matchingSyllables = allowed
      .filter((syllable) => word.startsWith(syllable))
      .sort((a, b) => b.length - a.length);

    if (matchingSyllables.length === 0) return [];

    return [{
      item,
      syllable: matchingSyllables[0],
    }];
  });

  // Intentamos evitar que la partida nueva tenga la misma
  // combinación ordenada de palabras que la anterior.
  let selected = shuffle(entries).slice(
    0,
    Math.min(count, entries.length),
  );

  const signature = (items: typeof selected) =>
    items
      .map(({ item, syllable }) => `${item.word}:${syllable}`)
      .sort()
      .join("|");

  if (
    selected.length > 1 &&
    signature(selected) === previousSignature
  ) {
    selected = shuffle(entries).slice(
      0,
      Math.min(count, entries.length),
    );
  }

  return shuffle(selected).map(({ item, syllable }, index) => ({
    id: `${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    image: item.emoji,
    word: item.word,
    syllable,
    placed: false,
    x: 50,
    y: 50,
    rotation: 0,
  }));
}