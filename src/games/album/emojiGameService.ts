
const API_URL = "https://emojireach.com/api/v1/emojis.es.json";

type ApiEmoji = {
  char: string;
  name: string;
  group?: string;
  keywords?: string[];
  slug?: string;
};

type ApiResponse = {
  emoji: ApiEmoji[];
};

export type GameOption = {
  word: string;
  emoji: string;
  group: string;
};

export type GameQuestion = {
  id: string;
  category: string;
  prompt: string;
  options: GameOption[];
  correctAnswer: string;
  hint: string;
  explanation: string;
};

// Solo admitimos conceptos familiares y fáciles de explicar.
// Los nombres de la API se relacionan con palabras infantiles.
const WORD_RULES: {
  word: string;
  group: string;
  names: string[];
}[] = [
  // Animales
  { word: "Perro", group: "Animales", names: ["perro"] },
  { word: "Gato", group: "Animales", names: ["gato"] },
  { word: "Conejo", group: "Animales", names: ["cara de conejo"] },
  { word: "Ratón", group: "Animales", names: ["ratón", "raton"] },
  { word: "Vaca", group: "Animales", names: ["vaca"] },
  { word: "Cerdo", group: "Animales", names: ["cerdo"] },
  { word: "León", group: "Animales", names: ["león", "leon"] },
  { word: "Mono", group: "Animales", names: ["mono"] },
  { word: "Pez", group: "Animales", names: ["pez"] },
  { word: "Delfín", group: "Animales", names: ["delfín", "delfin"] },
  { word: "Rana", group: "Animales", names: ["rana"] },
  { word: "Mariposa", group: "Animales", names: ["mariposa"] },
  { word: "Gorila", group: "Animales", names: ["gorila"] },
{ word: "Orangután", group: "Animales", names: ["orangután"] },
{ word: "Caniche", group: "Animales", names: ["caniche"] },
{ word: "Lobo", group: "Animales", names: ["lobo"] },
{ word: "Zorro", group: "Animales", names: ["zorro"] },
{ word: "Mapache", group: "Animales", names: ["mapache"] },
{ word: "Tigre", group: "Animales", names: ["tigre"] },
{ word: "Caballo", group: "Animales", names: ["caballo"] },
{ word: "Burro", group: "Animales", names: ["burro"] },
{ word: "Unicornio", group: "Animales", names: ["unicornio"] },
{ word: "Cebra", group: "Animales", names: ["cebra"] },
{ word: "Ciervo", group: "Animales", names: ["ciervo"] },
{ word: "Bisonte", group: "Animales", names: ["bisonte"] },
{ word: "Buey", group: "Animales", names: ["buey"] },

  // Animales de granja y mamíferos
  { word: "Oveja", group: "Animales", names: ["oveja"] },
  { word: "Cabra", group: "Animales", names: ["cabra"] },
  { word: "Dromedario", group: "Animales", names: ["dromedario"] },
  { word: "Llama", group: "Animales", names: ["llama"] },
  { word: "Jirafa", group: "Animales", names: ["jirafa"] },
  { word: "Elefante", group: "Animales", names: ["elefante"] },
  { word: "Rinoceronte", group: "Animales", names: ["rinoceronte"] },
  { word: "Hipopótamo", group: "Animales", names: ["hipopótamo"] },
  { word: "Hámster", group: "Animales", names: ["hámster"] },
  { word: "Ardilla", group: "Animales", names: ["ardilla"] },
  { word: "Erizo", group: "Animales", names: ["erizo"] },
  { word: "Oso", group: "Animales", names: ["oso"] },
  { word: "Oso polar", group: "Animales", names: ["oso polar"] },
  { word: "Koala", group: "Animales", names: ["koala"] },
  { word: "Panda", group: "Animales", names: ["panda"] },
  { word: "Canguro", group: "Animales", names: ["canguro"] },

  // Aves
  { word: "Gallina", group: "Animales", names: ["gallina"] },
  { word: "Gallo", group: "Animales", names: ["gallo"] },
  { word: "Pollito", group: "Animales", names: ["pollito"] },
  { word: "Pingüino", group: "Animales", names: ["pingüino"] },
  { word: "Paloma", group: "Animales", names: ["paloma"] },
  { word: "Pato", group: "Animales", names: ["pato"] },
  { word: "Búho", group: "Animales", names: ["búho"] },
  { word: "Flamenco", group: "Animales", names: ["flamenco"] },
  { word: "Pavo real", group: "Animales", names: ["pavo real"] },
  { word: "Loro", group: "Animales", names: ["loro"] },
  { word: "Oca", group: "Animales", names: ["oca"] },

  // Reptiles y dinosaurios
  { word: "Cocodrilo", group: "Animales", names: ["cocodrilo"] },
  { word: "Tortuga", group: "Animales", names: ["tortuga"] },
  { word: "Lagarto", group: "Animales", names: ["lagarto"] },
  { word: "Serpiente", group: "Animales", names: ["serpiente"] },
  { word: "Dragón", group: "Animales", names: ["dragón"] },
  { word: "Dinosaurio", group: "Animales", names: ["saurópodo"] },
  { word: "T. rex", group: "Animales", names: ["t-rex"] },

  // Animales marinos
  { word: "Ballena", group: "Animales", names: ["ballena"] },
  { word: "Orca", group: "Animales", names: ["orca"] },
  { word: "Foca", group: "Animales", names: ["foca"] },
  { word: "Pez tropical", group: "Animales", names: ["pez tropical"] },
  { word: "Pez globo", group: "Animales", names: ["pez globo"] },
  { word: "Tiburón", group: "Animales", names: ["tiburón"] },
  { word: "Pulpo", group: "Animales", names: ["pulpo"] },
  { word: "Medusa", group: "Animales", names: ["medusa"] },
  { word: "Cangrejo", group: "Animales", names: ["cangrejo"] },
  { word: "Gamba", group: "Animales", names: ["gamba"] },
  { word: "Calamar", group: "Animales", names: ["calamar"] },

  // Insectos y pequeños animales
  { word: "Caracol", group: "Animales", names: ["caracol"] },
  { word: "Oruga", group: "Animales", names: ["oruga"] },
  { word: "Hormiga", group: "Animales", names: ["hormiga"] },
  { word: "Abeja", group: "Animales", names: ["abeja"] },
  { word: "Escarabajo", group: "Animales", names: ["escarabajo"] },
  { word: "Mariquita", group: "Animales", names: ["mariquita"] },
  { word: "Grillo", group: "Animales", names: ["grillo"] },
  { word: "Araña", group: "Animales", names: ["araña"] },
  { word: "Mosquito", group: "Animales", names: ["mosquito"] },
  { word: "Mosca", group: "Animales", names: ["mosca"] },
  { word: "Gusano", group: "Animales", names: ["gusano"] },


  // Frutas
  { word: "Manzana", group: "Frutas", names: ["manzana"] },
  { word: "Plátano", group: "Frutas", names: ["plátano", "platano", "banana"] },
  { word: "Pera", group: "Frutas", names: ["pera"] },
  { word: "Fresa", group: "Frutas", names: ["fresa"] },
  { word: "Naranja", group: "Frutas", names: ["mandarina"] },
  { word: "Uvas", group: "Frutas", names: ["uvas", "uva"] },
  { word: "Cereza", group: "Frutas", names: ["cereza"] },
  { word: "Piña", group: "Frutas", names: ["piña", "pina"] },
  { word: "Sandía", group: "Frutas", names: ["sandía", "sandia"] },
  { word: "Melocotón", group: "Frutas", names: ["melocotón", "melocoton"] },
    // Frutas: añade las que aún no existan
  { word: "Melón", group: "Frutas", names: ["melón"] },
  { word: "Limón", group: "Frutas", names: ["limón"] },
  { word: "Mango", group: "Frutas", names: ["mango"] },
  { word: "Arándanos", group: "Frutas", names: ["arándanos"] },
  { word: "Kiwi", group: "Frutas", names: ["kiwi"] },
  { word: "Coco", group: "Frutas", names: ["coco"] },
    // Verduras
  { word: "Aguacate", group: "Verduras", names: ["aguacate"] },
  { word: "Berenjena", group: "Verduras", names: ["berenjena"] },
  { word: "Patata", group: "Verduras", names: ["patata"] },
  { word: "Maíz", group: "Verduras", names: ["espiga de maíz"] },
  { word: "Pimiento", group: "Verduras", names: ["pimiento"] },
  { word: "Pepino", group: "Verduras", names: ["pepino"] },
  { word: "Lechuga", group: "Verduras", names: ["verdura de hoja verde"] },
  { word: "Brócoli", group: "Verduras", names: ["brócoli"] },
  { word: "Ajo", group: "Verduras", names: ["ajo"] },
  { word: "Cebolla", group: "Verduras", names: ["cebolla"] },
  { word: "Guisantes", group: "Verduras", names: ["vaina"] },
    { word: "Tomate", group: "Verduras", names: ["tomate"] },
  { word: "Aceituna", group: "Verduras", names: ["aceituna"] },
  { word: "Castaña", group: "Frutos", names: ["castaña"] },

  // Transportes
  { word: "Coche", group: "Transportes", names: ["coche", "automóvil", "automovil"] },
  { word: "Autobús", group: "Transportes", names: ["autobús", "autobus"] },
  { word: "Tren", group: "Transportes", names: ["tren"] },
  { word: "Bicicleta", group: "Transportes", names: ["bicicleta"] },
  { word: "Avión", group: "Transportes", names: ["avión", "avion"] },
  { word: "Barco", group: "Transportes", names: ["barco"] },
  { word: "Cohete", group: "Transportes", names: ["cohete"] },
  { word: "Moto", group: "Transportes", names: ["motocicleta", "moto"] },
  { word: "Taxi", group: "Transportes", names: ["taxi"] },
{ word: "Camioneta", group: "Transportes", names: ["camioneta"] },
{ word: "Camión", group: "Transportes", names: ["camión de reparto"] },
{ word: "Tractor", group: "Transportes", names: ["tractor"] },
{ word: "Coche de carreras", group: "Transportes", names: ["coche de carreras"] },
{ word: "Patinete", group: "Transportes", names: ["patinete"] },
{ word: "Monopatín", group: "Transportes", names: ["monopatín"] },
{ word: "Patines", group: "Transportes", names: ["patines"] },

  // Comida
  { word: "Pan", group: "Comida", names: ["pan"] },
  { word: "Queso", group: "Comida", names: ["queso"] },
  { word: "Pizza", group: "Comida", names: ["pizza"] },
  { word: "Hamburguesa", group: "Comida", names: ["hamburguesa"] },
  { word: "Helado", group: "Comida", names: ["helado"] },
  { word: "Huevo", group: "Comida", names: ["huevo"] },
  { word: "Tarta", group: "Comida", names: ["tarta", "pastel"] },
  { word: "Zanahoria", group: "Comida", names: ["zanahoria"] },
  { word: "Cruasán", group: "Comida", names: ["cruasán"] },
  { word: "Barra de pan", group: "Comida", names: ["baguete"] },
  { word: "Tortitas", group: "Comida", names: ["tortitas"] },
  { word: "Gofre", group: "Comida", names: ["gofre"] },
  { word: "Patatas fritas", group: "Comida", names: ["patatas fritas"] },
  { word: "Perrito caliente", group: "Comida", names: ["perrito caliente"] },
  { word: "Sándwich", group: "Comida", names: ["sándwich"] },
  { word: "Taco", group: "Comida", names: ["taco"] },
  { word: "Paella", group: "Comida", names: ["paella"] },
  { word: "Palomitas", group: "Comida", names: ["palomitas"] },
  { word: "Ensalada", group: "Comida", names: ["ensalada"] },

  // Bebidas y recipientes
{ word: "Leche", group: "Bebidas", names: ["vaso de leche"] },
{ word: "Biberón", group: "Bebidas", names: ["biberón"] },
{ word: "Zumo", group: "Bebidas", names: ["tetrabrik"] },
{ word: "Té", group: "Bebidas", names: ["tazón de té"] },
{ word: "Bebida tropical", group: "Bebidas", names: ["bebida tropical"] },
{ word: "Té de burbujas", group: "Bebidas", names: ["té de burbujas"] },
{ word: "Vaso con pajita", group: "Bebidas", names: ["vaso con pajita"] },
{ word: "Cubito de hielo", group: "Bebidas", names: ["cubito de hielo"] },

  // Ropa
  { word: "Camiseta", group: "Ropa", names: ["camiseta"] },
  { word: "Pantalón", group: "Ropa", names: ["pantalón", "pantalon"] },
  { word: "Vestido", group: "Ropa", names: ["vestido"] },
  { word: "Zapato", group: "Ropa", names: ["zapato"] },
  { word: "Calcetín", group: "Ropa", names: ["calcetín", "calcetin"] },
  { word: "Gorra", group: "Ropa", names: ["gorra"] },
  { word: "Guantes", group: "Ropa", names: ["guantes"] },
  { word: "Bufanda", group: "Ropa", names: ["bufanda"] },

  // Material escolar
  { word: "Lápiz", group: "Colegio", names: ["lápiz", "lapiz"] },
  { word: "Libro", group: "Colegio", names: ["libro"] },
  { word: "Mochila", group: "Colegio", names: ["mochila"] },
  { word: "Regla", group: "Colegio", names: ["regla"] },
  { word: "Tijeras", group: "Colegio", names: ["tijeras"] },
  { word: "Crayón", group: "Colegio", names: ["crayón", "crayon"] },

  // Cosas de casa
  { word: "Cama", group: "Casa", names: ["cama"] },
  { word: "Silla", group: "Casa", names: ["silla"] },
  { word: "Lámpara", group: "Casa", names: ["lámpara", "lampara"] },
  { word: "Sofá", group: "Casa", names: ["sofá", "sofa"] },
  { word: "Reloj", group: "Casa", names: ["reloj"] },
  { word: "Espejo", group: "Casa", names: ["espejo"] },

  // Naturaleza y lugares
{ word: "Montaña", group: "Lugares", names: ["montaña"] },
{ word: "Montaña nevada", group: "Lugares", names: ["montaña con nieve"] },
{ word: "Volcán", group: "Lugares", names: ["volcán"] },
{ word: "Playa", group: "Lugares", names: ["playa y sombrilla"] },
{ word: "Desierto", group: "Lugares", names: ["desierto"] },
{ word: "Isla", group: "Lugares", names: ["isla desierta"] },
{ word: "Parque natural", group: "Lugares", names: ["parque nacional"] },
{ word: "Casa", group: "Lugares", names: ["casa"] },
{ word: "Castillo", group: "Lugares", names: ["castillo europeo"] },
{ word: "Hospital", group: "Lugares", names: ["hospital"] },
{ word: "Hotel", group: "Lugares", names: ["hotel"] },
{ word: "Fábrica", group: "Lugares", names: ["fábrica"] },


 // Flores y plantas
  { word: "Flor de cerezo", group: "Plantas", names: ["flor de cerezo"] },
  { word: "Rosa", group: "Plantas", names: ["rosa"] },
  { word: "Girasol", group: "Plantas", names: ["girasol"] },
  { word: "Flor", group: "Plantas", names: ["flor"] },
  { word: "Tulipán", group: "Plantas", names: ["tulipán"] },
  { word: "Planta", group: "Plantas", names: ["planta joven"] },
  { word: "Planta en maceta", group: "Plantas", names: ["planta de maceta"] },
  { word: "Árbol", group: "Plantas", names: ["árbol de hoja caduca"] },
  { word: "Palmera", group: "Plantas", names: ["palmera"] },
  { word: "Cactus", group: "Plantas", names: ["cactus"] },
  { word: "Trébol", group: "Plantas", names: ["trébol"] },
  { word: "Champiñón", group: "Plantas", names: ["champiñón"] },
  // Deportes
{ word: "Balón de fútbol", group: "Deportes", names: ["balón de fútbol"] },
{ word: "Balón de baloncesto", group: "Deportes", names: ["balón de baloncesto"] },
{ word: "Pelota de tenis", group: "Deportes", names: ["pelota de tenis"] },
{ word: "Pelota de voleibol", group: "Deportes", names: ["pelota de voleibol"] },
{ word: "Bolos", group: "Deportes", names: ["bolos"] },
{ word: "Portería", group: "Deportes", names: ["portería"] },
{ word: "Guante de boxeo", group: "Deportes", names: ["guante de boxeo"] },
{ word: "Patín de hielo", group: "Deportes", names: ["patín de hielo"] },
{ word: "Caña de pescar", group: "Deportes", names: ["caña de pescar"] },
{ word: "Máscara de buceo", group: "Deportes", names: ["máscara de buceo"] },
{ word: "Esquís", group: "Deportes", names: ["esquís"] },
{ word: "Trineo", group: "Deportes", names: ["trineo"] },
{ word: "Medalla de oro", group: "Deportes", names: ["medalla de oro"] },
{ word: "Trofeo", group: "Deportes", names: ["trofeo"] },

// Juguetes y juegos
{ word: "Yoyó", group: "Juguetes", names: ["yoyó"] },
{ word: "Cometa", group: "Juguetes", names: ["cometa"] },
{ word: "Mando de videojuegos", group: "Juguetes", names: ["mando de videoconsola"] },
{ word: "Dado", group: "Juguetes", names: ["dado"] },
{ word: "Pieza de puzle", group: "Juguetes", names: ["pieza de puzle"] },
{ word: "Osito de peluche", group: "Juguetes", names: ["osito de peluche"] },
{ word: "Piñata", group: "Juguetes", names: ["piñata"] },
{ word: "Varita mágica", group: "Juguetes", names: ["varita mágica"] },
{ word: "Bola de billar", group: "Juguetes", names: ["bola negra de billar"] },

];

// Me he quedado en este bloquede eogis de la api : [1200 … 1299]

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-ES")
    .trim();
}

let cachedOptions: GameOption[] | null = null;
let loadingPromise: Promise<GameOption[]> | null = null;

// Historial compartido por las partidas de esta sesión.
const usedQuestions = new Set<string>();




async function loadEmojis(): Promise<GameOption[]> {
  if (cachedOptions) return cachedOptions;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo cargar el catálogo de emojis.");
    }

    const data: unknown = await response.json();

    const items: ApiEmoji[] = Array.isArray(data)
      ? (data as ApiEmoji[])
      : typeof data === "object" &&
          data !== null &&
          "emoji" in data &&
          Array.isArray((data as ApiResponse).emoji)
        ? (data as ApiResponse).emoji
        : [];

    if (items.length === 0) {
      throw new Error("La API no ha devuelto un catálogo válido.");
    }

    const found = new Map<string, GameOption>();

    for (const item of items) {
      if (!item.char || !item.name) continue;

      const apiName = normalize(item.name);

      if (
        /skin tone|tono de piel|bandera|flag|variation selector/i.test(
          apiName,
        )
      ) {
        continue;
      }

      const rule = WORD_RULES.find((candidate) =>
        candidate.names.some((name) => {
          const normalizedName = normalize(name);

          return (
            apiName === normalizedName ||
            apiName.endsWith(` ${normalizedName}`)
          );
        }),
      );

      if (!rule || found.has(rule.word)) continue;

      found.set(rule.word, {
        word: rule.word,
        emoji: item.char,
        group: rule.group,
      });
    }

    const options = [...found.values()];

    if (options.length < 12) {
      throw new Error(
        "La API no contiene suficientes emojis reconocidos.",
      );
    }

    cachedOptions = options;
    return options;
  })();

  try {
    return await loadingPromise;
  } catch (error) {
    loadingPromise = null;
    throw error;
  }
}


function questionSignature(
  normalOptions: GameOption[],
  intruder: GameOption,
): string {
  // El orden de las opciones no afecta a la identidad de la pregunta.
  return [
    ...normalOptions.map((item) => item.word),
    intruder.word,
  ]
    .sort()
    .join("|");
}


export async function createRound(
  count = 10,
): Promise<GameQuestion[]> {
  const emojis = await loadEmojis();

  const groups = new Map<string, GameOption[]>();

  for (const item of emojis) {
    const groupItems = groups.get(item.group) ?? [];
    groupItems.push(item);
    groups.set(item.group, groupItems);
  }

  const usableGroups = [...groups.entries()].filter(
    ([, items]) => items.length >= 3,
  );

  if (usableGroups.length < 2) {
    throw new Error(
      "No hay suficientes categorías para crear preguntas.",
    );
  }

  const selected: {
    mainGroup: string;
    intruderGroup: string;
    normalOptions: GameOption[];
    intruder: GameOption;
    signature: string;
  }[] = [];

  const roundSignatures = new Set<string>();

  function fillRound(ignoreHistory: boolean): void {
    let attempts = 0;
    const maxAttempts = Math.max(count * 1000, 1000);

    while (
      selected.length < count &&
      attempts < maxAttempts
    ) {
      attempts++;

      const mainIndex = Math.floor(
        Math.random() * usableGroups.length,
      );

      const [mainGroup, mainItems] = usableGroups[mainIndex];

      const otherGroups = usableGroups.filter(
        ([group]) => group !== mainGroup,
      );

      const intruderIndex = Math.floor(
        Math.random() * otherGroups.length,
      );

      const [intruderGroup, intruderItems] =
        otherGroups[intruderIndex];

      const normalOptions = shuffle(mainItems).slice(0, 3);

      const intruder =
        intruderItems[
          Math.floor(Math.random() * intruderItems.length)
        ];

      const signature = questionSignature(
        normalOptions,
        intruder,
      );

      if (roundSignatures.has(signature)) continue;

      if (
        !ignoreHistory &&
        usedQuestions.has(signature)
      ) {
        continue;
      }

      roundSignatures.add(signature);

      selected.push({
        mainGroup,
        intruderGroup,
        normalOptions,
        intruder,
        signature,
      });
    }
  }

  // Primero evita las preguntas ya utilizadas en esta sesión.
  fillRound(false);

  // Si quedan pocas combinaciones nuevas, reinicia el historial.
  if (selected.length < count) {
    usedQuestions.clear();
    selected.length = 0;
    roundSignatures.clear();

    fillRound(true);
  }

  if (selected.length === 0) {
    throw new Error(
      "No se han podido generar preguntas.",
    );
  }

  for (const candidate of selected) {
    usedQuestions.add(candidate.signature);
  }

  return selected.map((candidate, index) => {
    const options = shuffle([
      ...candidate.normalOptions,
      candidate.intruder,
    ]);

    return {
      id: `${Date.now()}-${index}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      category: candidate.mainGroup,
      prompt: "¿Cuál es diferente?",
      options,
      correctAnswer: candidate.intruder.word,
      hint: `Tres son ${candidate.mainGroup.toLocaleLowerCase("es-ES")}. ¿Cuál no pertenece a ese grupo?`,
      explanation:
        `${candidate.normalOptions
          .map((item) => item.word)
          .join(", ")} son ${candidate.mainGroup.toLocaleLowerCase("es-ES")}. ` +
        `${candidate.intruder.word} es diferente porque pertenece al grupo ` +
        `${candidate.intruderGroup.toLocaleLowerCase("es-ES")}.`,
    };
  });
}


// Permite que otros juegos reutilicen el catálogo sin duplicar la API.
export async function getDominoOptions(): Promise<GameOption[]> {
  return loadEmojis();
}