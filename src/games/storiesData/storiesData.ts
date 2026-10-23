export interface StoryScene {
  id: string;
  emoji: string;
  description: string;
  imageQuery: string;
}

export interface Story {
  id: string;
  title: string;
  level: number;
  instruction: string;
  scenes: StoryScene[];
  ending: string;
}

const createScene = (
  id: string,
  emoji: string,
  description: string,
  imageQuery: string
): StoryScene => ({
  id,
  emoji,
  description,
  imageQuery,
});

export const storiesData: Story[] = [
  // NIVEL 1: TRES ESCENAS
  {
    id: "plantar-flor",
    title: "La semilla mágica",
    level: 1,
    instruction: "Ordena los pasos para que crezca una flor.",
    ending: "¡Muy bien! Con agua, tierra y paciencia, la semilla crece.",
    scenes: [
      createScene("semilla", "🌰", "Una niña planta una semilla en la tierra.", "child planting a seed in soil"),
      createScene("regar", "💧", "La niña riega la tierra con agua.", "watering a small plant with a watering can"),
      createScene("flor", "🌻", "¡Ha crecido una bonita flor!", "beautiful yellow sunflower growing in a garden"),
    ],
  },
  {
    id: "lavarse-dientes",
    title: "Dientes relucientes",
    level: 1,
    instruction: "¿Qué hacemos primero para lavarnos los dientes?",
    ending: "¡Genial! Una buena rutina ayuda a mantener los dientes sanos.",
    scenes: [
      createScene("cepillo", "🪥", "El niño prepara su cepillo de dientes.", "child holding a toothbrush in a bathroom"),
      createScene("pasta", "🦷", "Pone pasta de dientes en el cepillo.", "toothpaste being put on a toothbrush"),
      createScene("limpiar", "😁", "Se cepilla los dientes frente al espejo.", "child brushing teeth in front of bathroom mirror"),
    ],
  },
  {
    id: "hacer-bocadillo",
    title: "Un bocadillo delicioso",
    level: 1,
    instruction: "Ordena cómo se prepara el bocadillo.",
    ending: "¡Qué rico! Ya tenemos un bocadillo listo para comer.",
    scenes: [
      createScene("pan", "🍞", "Colocamos dos rebanadas de pan en un plato.", "two slices of bread on a plate"),
      createScene("relleno", "🧀", "Ponemos queso y tomate sobre el pan.", "cheese and tomato sandwich ingredients"),
      createScene("comer", "🥪", "Cerramos el bocadillo y nos lo comemos.", "fresh sandwich on a plate"),
    ],
  },
  {
    id: "dia-lluvia",
    title: "¡Está lloviendo!",
    level: 1,
    instruction: "Descubre qué hacemos cuando empieza a llover.",
    ending: "¡Exacto! Con el paraguas podemos pasear sin mojarnos tanto.",
    scenes: [
      createScene("nubes", "🌧️", "El cielo se llena de nubes y comienza a llover.", "dark rain clouds over a park"),
      createScene("paraguas", "☂️", "Una niña abre su paraguas.", "child opening a colorful umbrella in the rain"),
      createScene("paseo", "🥾", "La niña pasea protegida bajo su paraguas.", "child walking with an umbrella on a rainy day"),
    ],
  },
  {
    id: "lavar-manos",
    title: "Manos limpias",
    level: 1,
    instruction: "Pon en orden los pasos para lavarte las manos.",
    ending: "¡Perfecto! Las manos limpias nos ayudan a cuidar nuestra salud.",
    scenes: [
      createScene("mojar", "🚰", "Mojamos las manos con agua.", "hands being washed under a running tap"),
      createScene("jabon", "🧼", "Frotamos las manos con agua y jabón.", "hands covered in soap bubbles"),
      createScene("secar", "🧻", "Nos secamos las manos con una toalla limpia.", "hands being dried with a clean towel"),
    ],
  },

  // NIVEL 2: CUATRO ESCENAS
  {
    id: "galletas",
    title: "Cocinamos galletas",
    level: 2,
    instruction: "Ordena la receta desde los ingredientes hasta el resultado.",
    ending: "¡Estupendo! Con los ingredientes y los pasos correctos tenemos galletas.",
    scenes: [
      createScene("ingredientes", "🥣", "Preparamos la harina, los huevos y el azúcar.", "baking ingredients flour eggs and sugar on a table"),
      createScene("mezclar", "🥄", "Mezclamos todos los ingredientes en un bol.", "mixing cookie dough in a bowl"),
      createScene("horno", "🍪", "Metemos la masa en el horno para cocinarla.", "tray of cookies baking in an oven"),
      createScene("galletas-listas", "😋", "Sacamos las galletas y dejamos que se enfríen.", "freshly baked cookies cooling on a tray"),
    ],
  },
  {
    id: "cumpleanos",
    title: "Una fiesta sorpresa",
    level: 2,
    instruction: "¿Cómo se prepara una fiesta de cumpleaños?",
    ending: "¡Qué sorpresa! Todo está preparado para celebrar juntos.",
    scenes: [
      createScene("decorar", "🎈", "Decoramos la habitación con globos y guirnaldas.", "children decorating a room with balloons"),
      createScene("tarta", "🎂", "Colocamos la tarta en el centro de la mesa.", "birthday cake on a decorated table"),
      createScene("llegada", "🎁", "Llega la persona que cumple años y todos la reciben.", "child arriving at a birthday party with friends"),
      createScene("celebrar", "🎉", "Todos cantan y celebran el cumpleaños.", "children celebrating a birthday party"),
    ],
  },
  {
    id: "plantar-arbol",
    title: "El árbol del parque",
    level: 2,
    instruction: "Ordena cómo plantamos y cuidamos un árbol.",
    ending: "¡Muy bien! Si cuidamos los árboles, crecerán fuertes y sanos.",
    scenes: [
      createScene("agujero", "🪏", "Hacemos un agujero en la tierra.", "small hole dug in garden soil for planting a tree"),
      createScene("planton", "🌱", "Colocamos el pequeño árbol en el agujero.", "young tree sapling being planted in soil"),
      createScene("regar-arbol", "💦", "Cubrimos las raíces con tierra y regamos.", "watering a newly planted young tree"),
      createScene("arbol-grande", "🌳", "Con el tiempo, el árbol crece y da sombra.", "large leafy tree in a sunny park"),
    ],
  },
  {
    id: "ir-colegio",
    title: "Camino al colegio",
    level: 2,
    instruction: "Ayuda a preparar una mañana de colegio.",
    ending: "¡Listos para aprender! Llegar preparados hace que el día empiece mejor.",
    scenes: [
      createScene("despertar", "⏰", "Suena el despertador y el niño se levanta.", "child waking up in bed in the morning"),
      createScene("desayuno", "🥛", "Desayuna antes de salir de casa.", "healthy breakfast on a kitchen table"),
      createScene("mochila", "🎒", "Prepara su mochila con los libros.", "child packing school books into a backpack"),
      createScene("colegio", "🏫", "Llega al colegio para empezar las clases.", "children arriving at a primary school"),
    ],
  },
  {
    id: "muneco-nieve",
    title: "Un muñeco de nieve",
    level: 2,
    instruction: "Ordena cómo se construye un muñeco de nieve.",
    ending: "¡Fantástico! Con paciencia hemos creado un muñeco de nieve.",
    scenes: [
      createScene("nieve", "❄️", "Ha nevado y el jardín está cubierto de nieve.", "garden covered in fresh white snow"),
      createScene("bolas", "⛄", "Hacemos dos bolas grandes de nieve.", "two large snowballs on snowy ground"),
      createScene("montar", "🥕", "Apilamos las bolas y ponemos una nariz de zanahoria.", "building a snowman with a carrot nose"),
      createScene("terminado", "☃️", "El muñeco tiene ojos, bufanda y sombrero.", "finished cheerful snowman with scarf and hat"),
    ],
  },

  // NIVEL 3: CINCO ESCENAS
  {
    id: "mariposa",
    title: "La transformación de la mariposa",
    level: 3,
    instruction: "Ordena las etapas de la vida de una mariposa.",
    ending: "¡Excelente! Has descubierto cómo una oruga se transforma en mariposa.",
    scenes: [
      createScene("huevo", "🥚", "Una mariposa pone sus huevos en una hoja.", "butterfly eggs on a green leaf"),
      createScene("oruga", "🐛", "Del huevo sale una pequeña oruga.", "green caterpillar crawling on a leaf"),
      createScene("comer-hojas", "🌿", "La oruga come hojas y va creciendo.", "caterpillar eating a green leaf"),
      createScene("crisálida", "🟢", "La oruga forma una crisálida.", "butterfly chrysalis hanging from a branch"),
      createScene("mariposa-adulta", "🦋", "Sale una mariposa con alas de colores.", "colorful butterfly resting on a flower"),
    ],
  },
  {
    id: "excursion",
    title: "Una excursión a la montaña",
    level: 3,
    instruction: "Organiza la excursión desde los preparativos hasta la vuelta.",
    ending: "¡Lo has conseguido! Una excursión segura necesita planificación.",
    scenes: [
      createScene("preparar-mochila", "🎒", "Preparamos agua, comida y una mochila.", "hiking backpack with water bottle and food"),
      createScene("sendero", "🥾", "Comenzamos a caminar por el sendero.", "family hiking on a mountain trail"),
      createScene("cima", "⛰️", "Llegamos a un mirador con vistas a las montañas.", "beautiful mountain summit viewpoint"),
      createScene("descanso", "🍎", "Descansamos y comemos algo para recuperar energía.", "hikers having a snack outdoors on a mountain"),
      createScene("regreso", "🏡", "Regresamos a casa después de la excursión.", "family returning home after a mountain hike"),
    ],
  },
  {
    id: "reciclaje",
    title: "El viaje de una botella",
    level: 3,
    instruction: "Descubre cómo reciclamos una botella de plástico.",
    ending: "¡Muy bien! Reciclar ayuda a aprovechar los materiales y cuidar el planeta.",
    scenes: [
      createScene("usar-botella", "🧴", "Usamos una botella de plástico y terminamos de beber.", "empty reusable-looking plastic water bottle"),
      createScene("contenedor", "♻️", "Depositamos la botella en el contenedor adecuado.", "person putting a plastic bottle into a recycling bin"),
      createScene("recoger", "🚛", "Un camión recoge los residuos para reciclarlos.", "recycling collection truck on a street"),
      createScene("planta", "🏭", "La botella llega a una planta de reciclaje.", "plastic bottles sorted at a recycling facility"),
      createScene("nuevo-objeto", "🪴", "El material reciclado puede convertirse en otro producto.", "recycled plastic plant pot with a green plant"),
    ],
  },
  {
    id: "visita-medico",
    title: "Una visita al médico",
    level: 3,
    instruction: "Ordena lo que sucede durante una visita al médico.",
    ending: "¡Perfecto! Ir al médico nos ayuda a cuidar nuestra salud.",
    scenes: [
      createScene("malestar", "🤒", "El niño no se encuentra bien y se lo cuenta a su familia.", "child resting at home with a thermometer"),
      createScene("consulta", "🏥", "La familia llega a la consulta médica.", "family entering a doctor's office waiting room"),
      createScene("revision", "🩺", "El médico escucha y revisa al niño.", "pediatrician examining a child in a clinic"),
      createScene("consejo", "📋", "El médico explica cómo debe cuidarse.", "doctor explaining health advice to a parent and child"),
      createScene("recuperacion", "😊", "El niño descansa y empieza a encontrarse mejor.", "happy child resting at home after a doctor visit"),
    ],
  },
  {
    id: "dia-playa",
    title: "Un día en la playa",
    level: 3,
    instruction: "Ordena los preparativos y las actividades de un día de playa.",
    ending: "¡Genial! Con una buena preparación podemos disfrutar del día de playa.",
    scenes: [
      createScene("preparar-playa", "🧺", "Preparamos la bolsa, las toallas, el agua y la crema solar.", "beach bag towels sunscreen and water bottle"),
      createScene("llegada-playa", "🏖️", "Llegamos a la playa y buscamos un sitio adecuado.", "family arriving at a sunny sandy beach"),
      createScene("crema", "🧴", "Nos ponemos crema solar antes de exponernos al sol.", "parent applying sunscreen to a child at the beach"),
      createScene("jugar", "🏰", "Jugamos en la arena y construimos un castillo.", "children building a sandcastle on the beach"),
      createScene("volver", "🌅", "Recogemos nuestras cosas y volvemos a casa.", "family walking away from the beach at sunset"),
    ],
  },
];

export default storiesData;
