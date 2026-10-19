
export type GameInfo = {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  color: string;
  available: boolean;
};

export const games: GameInfo[] = [
  {
    id: "album",
    title: "El álbum de las palabras",
    description:
      "Encuentra la imagen que no pertenece al grupo y descubre por qué.",
    category: "Vocabulario y semántica",
    emoji: "🖼️",
    color: "#FCE7F3",
    available: true,
  },
  {
    id: "sounds",
    title: "Detectives de sonidos",
    description: "Escucha, reconoce y diferencia sonidos.",
    category: "Discriminación auditiva",
    emoji: "🔎",
    color: "#DBEAFE",
    available: false,
  },
  {
    id: "letter-train",
    title: "El tren de las letras",
    description:
      "Elige las letras en el orden correcto para formar palabras.",
    category: "Lectoescritura",
    emoji: "🔤",
    color: "#EDE9FE",
    available: true,
  },
  {
    id: "factory",
    title: "La fábrica de palabras",
    description: "Construye palabras y juega con sus sonidos.",
    category: "Conciencia fonológica",
    emoji: "🏭",
    color: "#D1FAE5",
    available: false,
  },
  {
    id: "stories",
    title: "Historias desordenadas",
    description: "Ordena las escenas para crear una historia.",
    category: "Lenguaje narrativo",
    emoji: "📚",
    color: "#FEF3C7",
    available: false,
  },
];