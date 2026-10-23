
export type SoundOption = {
  word: string;
  emoji: string;
};

export type SoundFamily = "Vocales" | "Consonantes";
export type SoundMode = "has" | "missing";

export type SoundQuestion = {
  id: string;
  family: SoundFamily;
  letter: string;
  mode: SoundMode;
  prompt: string;
  options: SoundOption[];
  correctAnswer: string;
  hint: string;
  explanation: string;
};

type WordItem = SoundOption;

const WORDS: WordItem[] = [
  // Animales
  { word: "Perro", emoji: "🐶" },
  { word: "Gato", emoji: "🐱" },
  { word: "Mono", emoji: "🐵" },
  { word: "Pato", emoji: "🦆" },
  { word: "Pez", emoji: "🐟" },
  { word: "Rana", emoji: "🐸" },
  { word: "Oso", emoji: "🐻" },
  { word: "León", emoji: "🦁" },
  { word: "Tigre", emoji: "🐯" },
  { word: "Lobo", emoji: "🐺" },
  { word: "Conejo", emoji: "🐰" },
  { word: "Elefante", emoji: "🐘" },
  { word: "Mariposa", emoji: "🦋" },
  { word: "Serpiente", emoji: "🐍" },
  { word: "Pulpo", emoji: "🐙" },
  { word: "Delfín", emoji: "🐬" },
  { word: "Ballena", emoji: "🐳" },
  { word: "Gallina", emoji: "🐔" },
  { word: "Caballo", emoji: "🐴" },
  { word: "Caracol", emoji: "🐌" },

  // Comida y frutas
  { word: "Manzana", emoji: "🍎" },
  { word: "Plátano", emoji: "🍌" },
  { word: "Pera", emoji: "🍐" },
  { word: "Uva", emoji: "🍇" },
  { word: "Fresa", emoji: "🍓" },
  { word: "Limón", emoji: "🍋" },
  { word: "Naranja", emoji: "🍊" },
  { word: "Sandía", emoji: "🍉" },
  { word: "Piña", emoji: "🍍" },
  { word: "Cereza", emoji: "🍒" },
  { word: "Tomate", emoji: "🍅" },
  { word: "Patata", emoji: "🥔" },
  { word: "Zanahoria", emoji: "🥕" },
  { word: "Pan", emoji: "🍞" },
  { word: "Queso", emoji: "🧀" },
  { word: "Pizza", emoji: "🍕" },
  { word: "Sopa", emoji: "🥣" },
  { word: "Huevo", emoji: "🥚" },
  { word: "Helado", emoji: "🍦" },
  { word: "Galleta", emoji: "🍪" },

  // Objetos y lugares
  { word: "Mano", emoji: "✋" },
  { word: "Madera", emoji: "🪵" },
  { word: "Cama", emoji: "🛏️" },
  { word: "Casa", emoji: "🏠" },
  { word: "Coche", emoji: "🚗" },
  { word: "Tren", emoji: "🚂" },
  { word: "Avión", emoji: "✈️" },
  { word: "Barco", emoji: "🚢" },
  { word: "Pelota", emoji: "⚽" },
  { word: "Libro", emoji: "📕" },
  { word: "Lápiz", emoji: "✏️" },
  { word: "Mochila", emoji: "🎒" },
  { word: "Silla", emoji: "🪑" },
  { word: "Reloj", emoji: "⏰" },
  { word: "Lámpara", emoji: "💡" },
  { word: "Teléfono", emoji: "📱" },
  { word: "Ventana", emoji: "🪟" },
  { word: "Zapato", emoji: "👟" },
  { word: "Sombrero", emoji: "👒" },
  { word: "Camisa", emoji: "👕" },

  // Naturaleza
  { word: "Sol", emoji: "☀️" },
  { word: "Luna", emoji: "🌙" },
  { word: "Estrella", emoji: "⭐" },
  { word: "Flor", emoji: "🌸" },
  { word: "Árbol", emoji: "🌳" },
  { word: "Hoja", emoji: "🍃" },
  { word: "Montaña", emoji: "⛰️" },
  { word: "Nube", emoji: "☁️" },
  { word: "Lluvia", emoji: "🌧️" },
  { word: "Fuego", emoji: "🔥" },
  { word: "Arcoíris", emoji: "🌈" },
  { word: "Mar", emoji: "🌊" },
  { word: "Piedra", emoji: "🪨" },
  { word: "Cactus", emoji: "🌵" },
  { word: "Hongo", emoji: "🍄" },

  // Personas y otras palabras
  { word: "Niño", emoji: "🧒" },
  { word: "Bebé", emoji: "👶" },
  { word: "Médico", emoji: "🧑‍⚕️" },
  { word: "Payaso", emoji: "🤡" },
  { word: "Princesa", emoji: "👸" },
  { word: "Música", emoji: "🎵" },
  { word: "Campana", emoji: "🔔" },
  { word: "Tambor", emoji: "🥁" },
  { word: "Dinosaurio", emoji: "🦕" },
];


function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-ES")
    .trim();
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function containsSound(word: string, letter: string): boolean {
  // En esta primera versión usamos letras de sonido estable.
  // Las tildes no cambian la identificación de la vocal.
  return normalize(word).includes(normalize(letter));
}

function makeSignature(
  family: SoundFamily,
  letter: string,
  mode: SoundMode,
  options: SoundOption[],
): string {
  return [
    family,
    letter,
    mode,
    ...options.map((option) => option.word).sort(),
  ].join("|");
}

function createQuestion(
  family: SoundFamily,
  letter: string,
  mode: SoundMode,
): SoundQuestion | null {
  const matching = WORDS.filter((item) =>
    containsSound(item.word, letter),
  );

  const notMatching = WORDS.filter(
    (item) => !containsSound(item.word, letter),
  );

  // Debe haber al menos cuatro opciones de cada tipo.
  if (matching.length < 4 || notMatching.length < 4) {
    return null;
  }

  let correct: SoundOption;
  let distractors: SoundOption[];

  if (mode === "has") {
    correct = shuffle(matching)[0];
    distractors = shuffle(
      notMatching.filter((item) => item.word !== correct.word),
    ).slice(0, 3);
  } else {
    correct = shuffle(notMatching)[0];
    distractors = shuffle(
      matching.filter((item) => item.word !== correct.word),
    ).slice(0, 3);
  }

  if (distractors.length !== 3) return null;

  const options = shuffle([correct, ...distractors]);
  const sound = `/${letter.toLocaleLowerCase("es-ES")}/`;
  const positive = mode === "has";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    family,
    letter,
    mode,
    prompt: positive
      ? `¿Cuál tiene el sonido ${sound}?`
      : `¿Cuál NO tiene el sonido ${sound}?`,
    options,
    correctAnswer: correct.word,
    hint: positive
      ? `Di despacio el nombre de cada imagen. ¿En cuál escuchas ${sound}?`
      : `Di despacio el nombre de cada imagen. ¿En cuál NO escuchas ${sound}?`,
    explanation: positive
      ? `¡${correct.word} contiene el sonido ${sound}!`
      : `¡${correct.word} no contiene el sonido ${sound}!`,
  };
}


export async function createSoundsRound(
  count = 10,
  family: SoundFamily = "Vocales",
  letter = "A",
  mode: SoundMode = "has",
): Promise<SoundQuestion[]> {
  if (count < 1) return [];

  const selected: SoundQuestion[] = [];
  const signatures = new Set<string>();
  const maxAttempts = count * 500;

  // Las 10 preguntas utilizan siempre la misma familia,
  // letra y modalidad elegidas por la profesora.
  for (
    let attempts = 0;
    selected.length < count && attempts < maxAttempts;
    attempts++
  ) {
    const question = createQuestion(family, letter, mode);

    if (!question) {
      throw new Error(
        `No hay suficientes palabras para el sonido ${letter}.`,
      );
    }

    const signature = makeSignature(
      question.family,
      question.letter,
      question.mode,
      question.options,
    );

    if (signatures.has(signature)) continue;

    signatures.add(signature);
    selected.push(question);
  }

  if (selected.length < count) {
    throw new Error(
      "No se han podido crear 10 preguntas diferentes. Prueba otra letra.",
    );
  }

  return selected;
}

