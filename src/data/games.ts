
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
    available: true,
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
  title: "El reto de las sílabas",
  description:
    "Escucha la sílaba y elige la respuesta correcta entre cuatro opciones.",
  category: "Conciencia fonológica",
  emoji: "🗣️",
  color: "#D1FAE5",
  available: true,
},
{
  id: "sound-quiz",
  title: "¿Qué sonido es?",
  description:
    "Escucha sonidos del mundo que te rodea y elige la imagen correcta.",
  category: "Audición y lenguaje",
  emoji: "👂",
  color: "#FDE68A",
  available: true,
},

  {
    id: "stories",
    title: "Historias desordenadas",
    description: "Ordena las escenas para crear una historia.",
    category: "Lenguaje narrativo",
    emoji: "📚",
    color: "#FEF3C7",
    available: true,
  },
  
  {
    id: "reading",
    title: "Detectives de lectura",
    description:
      "Lee historias creadas por inteligencia artificial y responde preguntas para demostrar lo que has comprendido.",
    category: "Comprensión lectora",
    emoji: "📖",
    color: "#EDE9FE",
    available: true,
  },
  
  {
    id: "letter-pairs",
    title: "La fábrica de parejas",
    description:
      "Une cada letra mayúscula con su minúscula y ayuda a la fábrica a funcionar.",
    category: "Lectoescritura",
    emoji: "🏭",
    color: "#F3E8FF",
    available: true,
  },
  {
  id: "syllable-domino",
  title: "El dominó de las sílabas",
  description:
    "Arrastra, gira y coloca fichas para relacionar imágenes y sílabas.",
  category: "Conciencia silábica",
  emoji: "🁣",
  color: "#FDE2E4",
  available: true,
},


];