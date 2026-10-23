
export type Theme =
  | "Aventura"
  | "Misterio"
  | "Animales"
  | "Fantasía"
  | "Ciencia"
  | "Emociones"
  | "Sorpresa";

export type Difficulty = "Fácil" | "Media" | "Difícil";
export type StoryLength = "Media cara A4" | "Una cara A4";

export type QuestionType =
  | "Comprensión literal"
  | "Inferencias"
  | "Causas y consecuencias"
  | "Orden de acontecimientos"
  | "Vocabulario"
  | "Emociones e intenciones";

export interface StoryFact {
  type: QuestionType;
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
}

export interface GeneratedStory {
  id: string;
  title: string;
  paragraphs: string[];
  facts: StoryFact[];
  theme: Theme;
  age: number;
  difficulty: Difficulty;
}

export interface StorySettings {
  age: number;
  theme: Theme;
  difficulty: Difficulty;
  length: StoryLength;
}

type Genre =
  | "misterio"
  | "aventura"
  | "fabula"
  | "ciencia"
  | "dialogo"
  | "diario"
  | "humor"
  | "fantasia"
  | "reportaje"
  | "cotidiano"
  | "leyenda"
  | "naturaleza";

interface StorySeed {
  id: string;
  genre: Genre;
  themes: Theme[];
  titles: string[];
  protagonist: string;
  setting: string;
  object: string;
  problem: string;
  clue: string;
  action: string;
  result: string;
  ending: string;
  lesson: string;
  word: string;
  meaning: string;
  feeling: string;
  intention: string;
}

const seeds: StorySeed[] = [
  {
    id: "museo",
    genre: "misterio",
    themes: ["Misterio", "Aventura", "Sorpresa"],
    titles: [
      "La huella del museo",
      "El caso de la vitrina vacía",
      "El misterio de las tres gotas",
    ],
    protagonist: "Inés, una niña observadora",
    setting: "el museo de historia de su ciudad",
    object: "una lupa y un cuaderno",
    problem: "una pequeña figura había desaparecido de una vitrina cerrada",
    clue: "había tres gotas de agua junto a la ventana y unas marcas diminutas en el suelo",
    action: "comparó las marcas con las ruedas de los carros de limpieza y preguntó al personal por sus recorridos",
    result: "descubrió que un carro había rozado la vitrina y que la figura se había guardado en un cajón para evitar que se rompiera",
    ending: "la figura regresó a su lugar y el museo añadió una nota para explicar cómo se protegían las piezas delicadas",
    lesson: "una buena investigación necesita observación, preguntas y pruebas",
    word: "indicio",
    meaning: "Una señal que puede ayudar a descubrir qué ha ocurrido.",
    feeling: "Curiosidad y prudencia",
    intention: "Averiguar qué había pasado sin acusar a nadie sin pruebas.",
  },
  {
    id: "zorro",
    genre: "fabula",
    themes: ["Animales", "Emociones", "Sorpresa"],
    titles: [
      "El zorro y el puente estrecho",
      "La carrera que ganó la paciencia",
      "El consejo de la tortuga",
    ],
    protagonist: "Bruno, un zorro orgulloso de su rapidez",
    setting: "un bosque atravesado por un arroyo",
    object: "una cesta de moras",
    problem: "Bruno quería cruzar un puente estrecho antes que los demás y no dejaba pasar a nadie",
    clue: "una tortuga le mostró que el puente se movía cada vez que alguien corría",
    action: "esperó su turno y cruzó despacio, sujetando bien la cesta",
    result: "todos pudieron pasar sin caerse y las moras llegaron enteras al otro lado",
    ending: "Bruno organizó después los turnos para que hasta los animales más pequeños pudieran cruzar",
    lesson: "ser rápido no siempre es mejor que ser paciente y pensar en los demás",
    word: "impaciente",
    meaning: "Que tiene dificultad para esperar tranquilamente.",
    feeling: "Impaciencia que se transforma en satisfacción",
    intention: "Llegar primero porque quería demostrar que era el más rápido.",
  },
  {
    id: "laboratorio",
    genre: "ciencia",
    themes: ["Ciencia", "Sorpresa", "Aventura"],
    titles: [
      "El misterio de las semillas dormidas",
      "El experimento de Nora",
      "¿Por qué no crecía la planta?",
    ],
    protagonist: "Nora, una alumna a la que le gustaba experimentar",
    setting: "el pequeño laboratorio de su colegio",
    object: "tres macetas con semillas iguales",
    problem: "las semillas de una maceta no crecían, aunque recibían agua todos los días",
    clue: "las tres macetas tenían distinta cantidad de luz y la tierra de una estaba siempre empapada",
    action: "anotó las condiciones de cada maceta y cambió solamente la cantidad de agua de la que estaba demasiado mojada",
    result: "después de varios días apareció un brote y Nora comprobó que regar más no siempre ayudaba a una planta",
    ending: "la clase creó una tabla para cuidar las plantas según sus necesidades",
    lesson: "para comprender una causa conviene observar, comparar y cambiar una cosa cada vez",
    word: "variable",
    meaning: "Un factor que puede cambiar y afectar al resultado de una prueba.",
    feeling: "Decepción al principio y entusiasmo al observar el brote",
    intention: "Descubrir qué condición impedía que las semillas crecieran.",
  },
  {
    id: "robot",
    genre: "humor",
    themes: ["Ciencia", "Sorpresa", "Emociones"],
    titles: [
      "El robot que daba consejos",
      "La máquina de los malentendidos",
      "Un ayudante muy peculiar",
    ],
    protagonist: "Leo, un inventor que construía máquinas con piezas usadas",
    setting: "el garaje de su casa",
    object: "un robot que interpretaba las órdenes de forma demasiado literal",
    problem: "cuando Leo le pidió que ordenara la habitación, el robot colocó todos los objetos por tamaño, incluidos los zapatos dentro de la nevera",
    clue: "el robot seguía cada palabra, pero no entendía para qué servía cada objeto",
    action: "Leo le enseñó a clasificar las cosas por su función y le dio instrucciones más claras",
    result: "el robot guardó los libros, ordenó los juguetes y dejó los zapatos junto a la puerta",
    ending: "esa noche el robot decidió ordenar también a Leo y lo colocó en la estantería de las cosas altas",
    lesson: "explicar bien lo que queremos ayuda a evitar muchos malentendidos",
    word: "literal",
    meaning: "Que interpreta las palabras según su significado directo, sin captar siempre la intención.",
    feeling: "Sorpresa y diversión ante los errores del robot",
    intention: "Conseguir que el robot le ayudara a ordenar de manera útil.",
  },
  {
    id: "carta",
    genre: "diario",
    themes: ["Emociones", "Sorpresa", "Misterio"],
    titles: [
      "Una carta para mi yo del futuro",
      "El secreto del cajón azul",
      "Lo que escribí el martes",
    ],
    protagonist: "Mara, una niña que acababa de cambiar de colegio",
    setting: "su nueva clase y su habitación",
    object: "un cuaderno donde escribía cada noche",
    problem: "Mara pensaba que nunca encontraría amigas porque todavía no conocía bien a sus compañeros",
    clue: "al releer su cuaderno, descubrió que había anotado tres conversaciones agradables que casi había olvidado",
    action: "decidió invitar a dos compañeras a preparar juntas una presentación",
    result: "descubrieron que compartían aficiones y organizaron un trabajo en el que cada una aportó una idea",
    ending: "Mara escribió en su cuaderno que un lugar nuevo podía empezar a sentirse familiar poco a poco",
    lesson: "a veces los pequeños avances son difíciles de notar hasta que miramos atrás",
    word: "progreso",
    meaning: "Un avance que nos acerca a una meta.",
    feeling: "Inseguridad que da paso a la esperanza",
    intention: "Encontrar una manera de sentirse parte de su nueva clase.",
  },
  {
    id: "isla",
    genre: "aventura",
    themes: ["Aventura", "Animales", "Misterio"],
    titles: [
      "El mapa de la isla pequeña",
      "La ruta de las conchas",
      "El camino que no aparecía en el mapa",
    ],
    protagonist: "Adrián, un aprendiz de explorador",
    setting: "una isla rocosa después de una marea alta",
    object: "un mapa dibujado a mano y una brújula",
    problem: "su grupo necesitaba llegar al refugio antes de que subiera de nuevo la marea",
    clue: "unas conchas alineadas señalaban una ruta elevada que no aparecía en el mapa",
    action: "comprobó la dirección con la brújula y guio al grupo por el camino firme",
    result: "todos llegaron al refugio sin atravesar la zona que empezaba a cubrir el agua",
    ending: "Adrián añadió la ruta al mapa para que los siguientes visitantes pudieran encontrarla",
    lesson: "prepararse, comprobar la información y colaborar puede hacer una aventura más segura",
    word: "orientarse",
    meaning: "Encontrar la dirección correcta para saber hacia dónde ir.",
    feeling: "Preocupación que se transforma en alivio",
    intention: "Encontrar una ruta segura antes de que subiera la marea.",
  },
  {
    id: "nubes",
    genre: "fantasia",
    themes: ["Fantasía", "Sorpresa", "Emociones"],
    titles: [
      "La niña que escuchaba las nubes",
      "El taller de los sueños perdidos",
      "La nube que no quería llover",
    ],
    protagonist: "Vera, una aprendiz de guardiana del cielo",
    setting: "una torre que flotaba por encima de las nubes",
    object: "una campana de cristal que cambiaba de sonido con el viento",
    problem: "las nubes habían dejado de llevar la lluvia a los jardines del valle",
    clue: "la campana sonaba diferente cuando el viento pasaba por una grieta de la torre",
    action: "siguió el sonido y reparó la pequeña abertura con una pieza de cristal encantado",
    result: "el viento recuperó su camino y las nubes comenzaron a avanzar hacia los jardines",
    ending: "la campana conservó una nota nueva que Vera nunca había oído antes",
    lesson: "escuchar con atención puede revelar problemas que no se ven a simple vista",
    word: "grieta",
    meaning: "Una abertura estrecha que aparece en una superficie.",
    feeling: "Preocupación por el valle y alegría al encontrar una solución",
    intention: "Descubrir por qué las nubes no llegaban a los jardines.",
  },
  {
    id: "mercado",
    genre: "cotidiano",
    themes: ["Emociones", "Sorpresa", "Aventura"],
    titles: [
      "El puesto de los pequeños cambios",
      "La compra imposible",
      "Un mercado lleno de soluciones",
    ],
    protagonist: "Samira, una niña encargada de ayudar en la compra familiar",
    setting: "el mercado del barrio",
    object: "una lista de compra y unas monedas",
    problem: "al llegar al último puesto, Samira descubrió que no tenía dinero suficiente para todos los ingredientes",
    clue: "la vendedora le explicó que algunas frutas de temporada costaban menos y servían para la misma receta",
    action: "revisó la lista, preguntó por los precios y eligió una alternativa que encajaba en su presupuesto",
    result: "pudo comprar lo necesario sin gastar más dinero del que llevaba",
    ending: "en casa prepararon la receta juntos y apuntaron la nueva combinación para otra ocasión",
    lesson: "comparar opciones y pedir ayuda puede resolver un problema cotidiano",
    word: "presupuesto",
    meaning: "La cantidad de dinero disponible para organizar unos gastos.",
    feeling: "Preocupación al principio y confianza después de comparar opciones",
    intention: "Completar la compra sin superar el dinero disponible.",
  },
  {
    id: "ballena",
    genre: "naturaleza",
    themes: ["Animales", "Aventura", "Ciencia"],
    titles: [
      "La llamada bajo el agua",
      "El sonido de la ballena",
      "Tres notas en el océano",
    ],
    protagonist: "Nico, un joven ayudante de un equipo marino",
    setting: "una estación de investigación junto al océano",
    object: "un hidrófono para escuchar sonidos submarinos",
    problem: "el equipo oyó llamadas de una cría de ballena que parecía haberse separado de su grupo",
    clue: "la cría repetía tres notas cada vez que el equipo detectaba sonidos de ballenas adultas a lo lejos",
    action: "grabó las llamadas y compartió las observaciones con los especialistas, que siguieron la actividad sin acercarse demasiado",
    result: "el equipo localizó al grupo y observó cómo la cría nadaba de nuevo junto a las ballenas adultas",
    ending: "Nico guardó la grabación para estudiar cómo se comunicaban aquellos animales",
    lesson: "observar a los animales con paciencia y respetar su espacio ayuda a conocerlos mejor",
    word: "hidrófono",
    meaning: "Un dispositivo que capta sonidos bajo el agua.",
    feeling: "Preocupación por la cría y alivio al verla reunida con el grupo",
    intention: "Ayudar al equipo a comprender los sonidos sin molestar a los animales.",
  },
  {
    id: "entrevista",
    genre: "reportaje",
    themes: ["Ciencia", "Animales", "Sorpresa"],
    titles: [
      "La científica que estudia las hormigas",
      "Preguntas diminutas, respuestas enormes",
      "Un día entre insectos",
    ],
    protagonist: "Alex, reportero del periódico escolar",
    setting: "un centro de estudio de insectos",
    object: "una libreta de preguntas y una cámara",
    problem: "Alex quería explicar cómo encontraban alimento las hormigas sin perderse",
    clue: "la científica le mostró que algunas hormigas dejaban rastros químicos que otras podían seguir",
    action: "entrevistó a la científica y anotó ejemplos que pudiera explicar a sus compañeros",
    result: "preparó un reportaje que mostraba cómo las hormigas colaboraban para encontrar comida",
    ending: "varios lectores propusieron observar otros animales y comparar sus formas de comunicarse",
    lesson: "hacer buenas preguntas y comprobar la información permite explicar mejor un tema",
    word: "rastro",
    meaning: "Una señal que queda y que puede ayudar a seguir o reconocer algo.",
    feeling: "Curiosidad y sorpresa ante la organización de las hormigas",
    intention: "Explicar a sus compañeros un comportamiento animal usando información fiable.",
  },
  {
    id: "farol",
    genre: "leyenda",
    themes: ["Fantasía", "Misterio", "Sorpresa"],
    titles: [
      "La leyenda del farol azul",
      "La luz que aparecía en el acantilado",
      "El guardián de la niebla",
    ],
    protagonist: "Lúa, una joven que vivía en un pueblo costero",
    setting: "un acantilado donde, según una vieja leyenda, aparecía una luz azul",
    object: "un farol antiguo encontrado en el almacén del puerto",
    problem: "los pescadores veían una luz extraña y temían que anunciara una tormenta",
    clue: "Lúa observó que la luz aparecía siempre cuando la niebla cubría una señal metálica del acantilado",
    action: "avisó a los mayores del pueblo y exploró el lugar durante el día, acompañada y sin acercarse al borde",
    result: "descubrieron que la luz del farol se reflejaba en la señal cuando la niebla tenía una densidad determinada",
    ending: "el pueblo conservó la historia del farol, pero añadió una explicación para que la leyenda no provocara miedo",
    lesson: "las historias tradicionales pueden ser fascinantes y también podemos investigar sus posibles orígenes",
    word: "reflejo",
    meaning: "Una imagen o luz que rebota en una superficie.",
    feeling: "Miedo inicial que da paso a la curiosidad",
    intention: "Averiguar el origen de la luz y evitar que el pueblo se asustara sin motivo.",
  },
  {
    id: "intercambio",
    genre: "dialogo",
    themes: ["Emociones", "Sorpresa", "Aventura"],
    titles: [
      "La reunión de las ideas diferentes",
      "Un plan entre cuatro",
      "La obra que casi no se estrenó",
    ],
    protagonist: "Aina, una alumna que prefería trabajar sola",
    setting: "el aula donde su grupo preparaba una obra para la fiesta escolar",
    object: "una caja con tarjetas de personajes y escenas",
    problem: "el grupo no conseguía ponerse de acuerdo porque cada persona quería una obra distinta",
    clue: "Aina descubrió que todas las propuestas tenían un personaje que necesitaba ayuda",
    action: "propuso combinar las ideas y pidió que cada compañero eligiera una tarea que se le diera bien",
    result: "el grupo creó una historia que mezclaba humor, misterio y una escena musical",
    ending: "la obra recibió muchos aplausos y el grupo decidió volver a trabajar junto en otro proyecto",
    lesson: "escuchar diferentes ideas puede producir soluciones que nadie habría imaginado por su cuenta",
    word: "acuerdo",
    meaning: "Una decisión compartida por varias personas.",
    feeling: "Frustración que se convierte en entusiasmo",
    intention: "Encontrar una solución que permitiera a todos participar en la obra.",
  },
];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function makeParagraphs(seed: StorySeed): string[] {
  switch (seed.genre) {
    case "misterio":
      return [
        `Todo parecía normal en ${seed.setting}, hasta que ocurrió algo extraño: ${seed.problem}.`,
        `${seed.protagonist} decidió investigar. Llevaba ${seed.object}, pero sabía que no bastaba con mirar deprisa.`,
        `Pronto encontró una pista: ${seed.clue}. Aquello no demostraba todavía qué había pasado, aunque sí indicaba dónde buscar.`,
        `En lugar de señalar a alguien sin pruebas, decidió actuar con cuidado: ${seed.action}.`,
        `La información reunida permitió aclarar el misterio. ${capitalize(seed.result)}.`,
        seed.ending,
        `Desde entonces, ${seed.protagonist} recordó que ${seed.lesson}.`,
      ];

    case "fabula":
      return [
        `En ${seed.setting} vivía ${seed.protagonist}. Le gustaba pensar que siempre sabía cuál era la mejor manera de hacer las cosas.`,
        `Un día apareció un problema: ${seed.problem}. ${seed.protagonist} quiso resolverlo a su manera, pero algo no salió como esperaba.`,
        `Entonces observó un detalle que había pasado por alto: ${seed.clue}.`,
        `Después de pensarlo, decidió cambiar de actitud: ${seed.action}.`,
        `La decisión tuvo un resultado que nadie había conseguido antes. ${capitalize(seed.result)}.`,
        seed.ending,
        `La historia dejó una enseñanza: ${seed.lesson}.`,
      ];

    case "ciencia":
      return [
        `A ${seed.protagonist} le encantaba hacer preguntas. En ${seed.setting} tenía ${seed.object} para investigar algo que no entendía.`,
        `El problema era el siguiente: ${seed.problem}. La primera explicación parecía razonable, pero todavía faltaban pruebas.`,
        `Al comparar los datos, descubrió algo importante: ${seed.clue}.`,
        `Preparó una prueba y anotó lo que sucedía. Para comprobar su idea, ${seed.action}.`,
        `Los resultados fueron reveladores: ${capitalize(seed.result)}.`,
        seed.ending,
        `Su experiencia le enseñó que ${seed.lesson}.`,
      ];

    case "dialogo":
      return [
        `En ${seed.setting}, ${seed.protagonist} se reunió con sus compañeros. El grupo tenía ${seed.object}, pero no lograba ponerse de acuerdo.`,
        `—Tenemos un problema —dijo alguien—. ${capitalize(seed.problem)}.`,
        `—¿Y si primero averiguamos qué tenemos en común? —propuso ${seed.protagonist}. Al escuchar a los demás, descubrió que ${seed.clue}.`,
        `—Podemos probar una idea que reúna nuestras propuestas —dijo. Entonces ${seed.action}.`,
        `Al poner el plan en práctica, ${seed.result}.`,
        seed.ending,
        `Todos aprendieron que ${seed.lesson}.`,
      ];

    case "diario":
      return [
        `Querido diario: hoy he vuelto a pensar en lo que ocurre en ${seed.setting}. Soy ${seed.protagonist} y llevo días dándole vueltas a una situación: ${seed.problem}.`,
        `Esta mañana tenía ${seed.object}. Mientras repasaba lo sucedido, recordé un detalle: ${seed.clue}.`,
        `No estaba segura de qué hacer, pero decidí intentarlo de otra manera. ${capitalize(seed.action)}.`,
        `Poco a poco, las cosas cambiaron. ${capitalize(seed.result)}.`,
        seed.ending,
        `Ahora creo que ${seed.lesson}. Mañana seguiré observando lo que sucede.`,
      ];

    case "humor":
      return [
        `En ${seed.setting}, ${seed.protagonist} tenía ${seed.object}. Estaba convencido de que su invento resolvería cualquier problema.`,
        `Todo empezó cuando ${seed.problem}. El resultado fue tan extraño que hasta el reloj pareció quedarse pensando.`,
        `Tras observar el desastre, encontró una pista: ${seed.clue}.`,
        `—¡Ahora sí que lo tengo! —exclamó. Para arreglarlo, ${seed.action}.`,
        `Esta vez funcionó mejor: ${capitalize(seed.result)}.`,
        seed.ending,
        `Desde aquel día, ${seed.protagonist} comprendió que ${seed.lesson}. Aunque su siguiente invento todavía daba consejos a las cucharas.`,
      ];

    case "fantasia":
      return [
        `Más allá de los caminos conocidos estaba ${seed.setting}. Allí vivía ${seed.protagonist}, que guardaba con cuidado ${seed.object}.`,
        `Una mañana ocurrió algo imposible: ${seed.problem}. Si nadie encontraba una solución, las cosas podían empeorar.`,
        `Mientras buscaba una respuesta, descubrió una señal mágica: ${seed.clue}.`,
        `Reunió valor y decidió actuar. ${capitalize(seed.action)}.`,
        `La magia respondió de una forma inesperada. ${capitalize(seed.result)}.`,
        seed.ending,
        `Desde entonces, ${seed.protagonist} sabía que ${seed.lesson}.`,
      ];

    case "reportaje":
      return [
        `**Un reportaje de Alex**\n\nEn ${seed.setting}, ${seed.protagonist} se propuso responder una pregunta: ¿cómo podía comprender mejor lo que ocurría allí?`,
        `El tema de su investigación era este: ${seed.problem}. Para empezar, preparó ${seed.object}.`,
        `Durante la visita, recogió una observación importante: ${seed.clue}.`,
        `Después entrevistó a las personas que conocían el tema y contrastó sus respuestas. ${capitalize(seed.action)}.`,
        `La información reunida mostró que ${seed.result}.`,
        seed.ending,
        `La principal conclusión del reportaje fue que ${seed.lesson}.`,
      ];

    case "cotidiano":
      return [
        `Aquel día, ${seed.protagonist} tenía que ocuparse de algo en ${seed.setting}. Llevaba ${seed.object} y pensaba que todo sería sencillo.`,
        `Pero surgió un contratiempo: ${seed.problem}.`,
        `En lugar de rendirse, se detuvo a revisar la situación y descubrió que ${seed.clue}.`,
        `Entonces decidió ${seed.action}.`,
        `La solución dio resultado. ${capitalize(seed.result)}.`,
        seed.ending,
        `Al final comprendió que ${seed.lesson}.`,
      ];

    case "aventura":
      return [
        `La aventura comenzó en ${seed.setting}. ${seed.protagonist} llevaba ${seed.object} y tenía muchas ganas de explorar.`,
        `De pronto, apareció una dificultad: ${seed.problem}. El grupo no podía seguir como si nada.`,
        `Antes de avanzar, ${seed.protagonist} observó el entorno y encontró una pista: ${seed.clue}.`,
        `Era el momento de decidir. ${capitalize(seed.action)}.`,
        `El plan funcionó. ${capitalize(seed.result)}.`,
        seed.ending,
        `Aquella experiencia demostró que ${seed.lesson}.`,
      ];

    case "leyenda":
      return [
        `Los mayores de ${seed.setting} contaban una historia que pocos se atrevían a investigar. Su protagonista era ${seed.protagonist}.`,
        `Según la leyenda, todo comenzó cuando ${seed.problem}. Algunos creían que había una explicación sobrenatural.`,
        `${seed.protagonist} decidió observar los hechos con atención. La pista más importante fue que ${seed.clue}.`,
        `Con prudencia, y sin ponerse en peligro, decidió ${seed.action}.`,
        `La investigación reveló que ${seed.result}.`,
        seed.ending,
        `Desde entonces, la leyenda se contó de otra manera, recordando que ${seed.lesson}.`,
      ];

    case "naturaleza":
      return [
        `En ${seed.setting}, ${seed.protagonist} observaba a los animales y anotaba lo que aprendía. Para hacerlo, utilizaba ${seed.object}.`,
        `Un día detectó una situación que le preocupó: ${seed.problem}.`,
        `En lugar de sacar conclusiones rápidas, esperó y observó. Descubrió que ${seed.clue}.`,
        `Compartió sus observaciones con personas expertas y, siguiendo sus indicaciones, ${seed.action}.`,
        `Con el tiempo, ${seed.result}.`,
        seed.ending,
        `La experiencia le recordó que ${seed.lesson}.`,
      ];
  }
}

function capitalize(text: string): string {
  return text.length ? text[0].toLowerCase() + text.slice(1) : text;
}

function simplify(text: string, age: number): string {
  if (age > 7) return text;

  const replacements: [RegExp, string][] = [
    [/\bcontrastó\b/gi, "comparó"],
    [/\bcontratiempos\b/gi, "problemas"],
    [/\bsobrenatural\b/gi, "mágico"],
    [/\bdeterminada\b/gi, "cierta"],
    [/\bobservaciones\b/gi, "cosas que vio"],
    [/\bcontrastar\b/gi, "comparar"],
    [/\bprovisional\b/gi, "por ahora"],
    [/\bdensidad\b/gi, "cantidad"],
    [/\bpresupuesto\b/gi, "dinero disponible"],
  ];

  return replacements.reduce(
    (result, [pattern, replacement]) =>
      result.replace(pattern, replacement),
    text,
  );
}

function makeFacts(seed: StorySeed, difficulty: Difficulty): StoryFact[] {
  const facts: StoryFact[] = [
    {
      type: "Comprensión literal",
      prompt: "¿Quién es el personaje principal de la historia?",
      answer: seed.protagonist,
      distractors: [
        `Una persona que visita ${seed.setting} por casualidad`,
        "Un personaje que solo aparece al final",
        "Alguien que no participa en los acontecimientos",
      ],
      explanation: `${seed.protagonist} es quien afronta la situación principal del relato.`,
    },
    {
      type: "Comprensión literal",
      prompt: "¿Dónde sucede la historia?",
      answer: seed.setting,
      distractors: [
        "En un aeropuerto durante un viaje",
        "En una isla desierta sin habitantes",
        "En un estadio durante una competición",
      ],
      explanation: `El relato sitúa los acontecimientos en ${seed.setting}.`,
    },
    {
      type: "Comprensión literal",
      prompt: "¿Qué problema aparece al principio?",
      answer: seed.problem,
      distractors: [
        "Todo sale como estaba previsto y no ocurre nada inesperado",
        "El protagonista decide abandonar su actividad sin intentarlo",
        "Un personaje resuelve el problema antes de que aparezca",
      ],
      explanation: `El conflicto inicial consiste en que ${seed.problem}.`,
    },
    {
      type: "Inferencias",
      prompt:
        difficulty === "Fácil"
          ? "¿Qué pista ayudó al personaje?"
          : "¿Por qué fue importante fijarse en la pista encontrada?",
      answer: seed.clue,
      distractors: [
        "Porque confirmó que no hacía falta investigar nada",
        "Porque permitió resolverlo todo sin tomar ninguna decisión",
        "Porque demostró que la primera idea siempre era correcta",
      ],
      explanation: `La pista fue importante porque aportó información para comprender la situación: ${seed.clue}.`,
    },
    {
      type: "Causas y consecuencias",
      prompt: "¿Qué hizo el personaje para afrontar el problema?",
      answer: seed.action,
      distractors: [
        "Ignoró las señales y esperó sin hacer nada",
        "Acusó a otra persona sin comprobar los hechos",
        "Cambió de tema para evitar buscar una solución",
      ],
      explanation: `Ante el problema, el personaje decidió actuar: ${seed.action}.`,
    },
    {
      type: "Causas y consecuencias",
      prompt: "¿Cuál fue el resultado de sus acciones?",
      answer: seed.result,
      distractors: [
        "La situación quedó exactamente igual y nadie aprendió nada",
        "El personaje empeoró el problema a propósito",
        "Todos olvidaron el asunto sin encontrar ninguna respuesta",
      ],
      explanation: `La acción tuvo como resultado que ${seed.result}.`,
    },
    {
      type: "Orden de acontecimientos",
      prompt: "¿Qué ocurrió antes de que el personaje encontrara una solución?",
      answer: seed.clue,
      distractors: [
        seed.ending,
        seed.result,
        "El personaje celebró el éxito antes de conocer el problema",
      ],
      explanation: `Primero apareció una pista que ayudó a comprender la situación; después se tomó una decisión y llegó el resultado.`,
    },
    {
      type: "Vocabulario",
      prompt: `¿Qué significa «${seed.word}» en el contexto de esta actividad?`,
      answer: seed.meaning,
      distractors: [
        "Una opinión que no puede explicarse ni comprobarse",
        "Una acción que siempre se hace por accidente",
        "Una palabra que significa lo contrario de lo que dice el relato",
      ],
      explanation: `En este contexto, «${seed.word}» significa: ${seed.meaning}`,
    },
    {
      type: "Emociones e intenciones",
      prompt: "¿Qué sentimiento experimentó el personaje?",
      answer: seed.feeling,
      distractors: [
        "Indiferencia absoluta desde el principio hasta el final",
        "Enfado con todos sin que exista ningún motivo",
        "Alegría constante porque no ocurrió ningún problema",
      ],
      explanation: `La situación y las decisiones del personaje se relacionan con estos sentimientos: ${seed.feeling}.`,
    },
    {
      type: "Emociones e intenciones",
      prompt: "¿Qué pretendía conseguir el personaje?",
      answer: seed.intention,
      distractors: [
        "Crear un problema nuevo para complicar la situación",
        "Evitar que nadie pudiera comprender lo ocurrido",
        "Conseguir algo sin prestar atención a las consecuencias",
      ],
      explanation: `Su intención era ${seed.intention}`,
    },
  ];

  if (difficulty === "Fácil") {
    return facts.filter(
      (fact) =>
        fact.type === "Comprensión literal" ||
        fact.type === "Causas y consecuencias" ||
        fact.type === "Orden de acontecimientos" ||
        fact.type === "Vocabulario",
    );
  }

  return facts;
}

export function generateStory(
  settings: StorySettings,
  previousStoryId?: string,
): GeneratedStory {
  const age = Math.max(6, Math.min(10, settings.age));

  const matching = seeds.filter((seed) =>
    seed.themes.includes(settings.theme),
  );

  const previousSeedId = previousStoryId?.split("-")[0];

  const alternatives = matching.filter(
    (seed) => seed.id !== previousSeedId,
  );

  const candidates =
    alternatives.length > 0
      ? alternatives
      : matching.length > 0
        ? matching
        : seeds;

  const seed = pick(candidates);
  const paragraphs = makeParagraphs(seed);

  if (settings.length === "Una cara A4") {
    paragraphs.splice(
      Math.max(2, paragraphs.length - 2),
      0,
      `Para tomar una decisión, ${seed.protagonist} tuvo que considerar lo que sabía, lo que todavía desconocía y las posibles consecuencias de actuar deprisa.`,
      `También comprendió que una primera explicación no siempre es suficiente. Revisar las pistas y escuchar otras ideas permitió entender mejor lo ocurrido.`,
    );
  }

  const adjustedParagraphs = paragraphs.map((paragraph) =>
    simplify(paragraph, age),
  );

  const facts = makeFacts(seed, settings.difficulty);

  if (settings.difficulty === "Difícil") {
    facts.push({
      type: "Inferencias",
      prompt: "¿Qué podría haber ocurrido si el personaje hubiera ignorado la pista?",
      answer:
        "Habría tenido más dificultades para comprender el problema y elegir una solución adecuada.",
      distractors: [
        "Habría conocido todas las respuestas sin investigar",
        "El problema habría desaparecido automáticamente",
        "La pista habría resuelto por sí sola cualquier dificultad",
      ],
      explanation: `La pista aportó información útil: ${seed.clue}. Sin ella, encontrar una solución habría sido más difícil.`,
    });
  }

  return {
    id: `${seed.id}-${Math.random().toString(36).slice(2, 8)}`,
    title: pick(seed.titles),
    paragraphs: adjustedParagraphs,
    facts: shuffle(facts),
    theme: settings.theme,
    age,
    difficulty: settings.difficulty,
  };
}

export function shuffleOptions(
  correct: string,
  distractors: string[],
): string[] {
  const unique = [...new Set(distractors)].filter(
    (option) => option !== correct,
  );

  return shuffle([correct, ...unique.slice(0, 3)]);
}
