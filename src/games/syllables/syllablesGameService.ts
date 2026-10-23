
export type SyllableType = "direct" | "inverse" | "blended";

export type SyllableQuestion = {
  id: string;
  target: string;
  options: string[];
  type: SyllableType;
};

export const CONSONANTS = [
  "B", "C", "D", "F", "G", "L", "M",
  "N", "P", "R", "S", "T", "V"
];

export const BLENDS = [
  "BL", "BR", "CL", "CR", "DR",
  "FL", "FR", "GL", "GR", "PL",
  "PR", "TR"
];

const VOWELS = ["A", "E", "I", "O", "U"];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function makeSyllables(
  consonants: string[],
  type: SyllableType
): string[] {
  if (type === "direct") {
    return unique(
      consonants.flatMap((c) =>
        VOWELS.map((v) => `${c}${v}`)
      )
    );
  }

  if (type === "inverse") {
    return unique(
      consonants.flatMap((c) =>
        VOWELS.map((v) => `${v}${c}`)
      )
    );
  }

  const selected = new Set(consonants);

  const validBlends = BLENDS.filter(
    (blend) =>
      selected.has(blend[0]) &&
      selected.has(blend[1])
  );

  return unique(
    validBlends.flatMap((blend) =>
      VOWELS.map((v) => `${blend}${v}`)
    )
  );
}

function makeOptions(
  target: string,
  pool: string[],
  type: SyllableType
): string[] {
  const similar = pool.filter((candidate) => {
    if (candidate === target) return false;

    if (type === "direct") {
      return candidate.slice(-1) === target.slice(-1);
    }

    if (type === "inverse") {
      return candidate[0] === target[0];
    }

    return (
      candidate.length === target.length &&
      candidate.slice(-1) === target.slice(-1)
    );
  });

  const other = pool.filter(
    (candidate) =>
      candidate !== target && !similar.includes(candidate)
  );

  const distractors = shuffle([
    ...shuffle(similar),
    ...shuffle(other),
  ]).slice(0, 3);

  if (distractors.length < 3) {
    throw new Error(
      "No hay suficientes sílabas diferentes para crear cuatro opciones."
    );
  }

  return shuffle(unique([target, ...distractors]));
}


export function createSyllablesRound(
  count: number,
  consonants: string[],
  types: SyllableType[]
): SyllableQuestion[] {
  const pool = unique(
    types.flatMap((type) => makeSyllables(consonants, type))
  );

  if (pool.length < 4) {
    throw new Error(
      "Selecciona más consonantes o más tipos de sílabas para tener suficientes opciones."
    );
  }

  const total = Math.min(count, pool.length);
  const targets = shuffle(pool).slice(0, total);

  return targets.map((target, index) => {
    const questionType = types.find((type) =>
      makeSyllables(consonants, type).includes(target)
    ) ?? types[0];

    return {
      id: `syllable-${index + 1}`,
      target,
      options: makeOptions(target, pool, questionType),
      type: questionType,
    };
  });
}


export function getSyllableTypeLabel(
  type: SyllableType
): string {
  switch (type) {
    case "direct":
      return "Directas";
    case "inverse":
      return "Inversas";
    case "blended":
      return "Trabadas";
  }
}
