

import type {
  GeneratedStory,
  QuestionType,
  StoryFact,
} from "./storyGenerator";

import { shuffleOptions } from "./storyGenerator";


export interface ReadingQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const defaultTypes: QuestionType[] = [
  "Comprensión literal",
  "Inferencias",
  "Causas y consecuencias",
  "Orden de acontecimientos",
  "Vocabulario",
  "Emociones e intenciones",
];


export function generateQuestions(
  story: GeneratedStory,
  selectedTypes: QuestionType[],
): ReadingQuestion[] {
  const requestedTypes = selectedTypes.length
    ? selectedTypes
    : defaultTypes;

  const available = [...story.facts];
  const chosen: StoryFact[] = [];

  // Elegimos una pregunta de cada tipo solicitado, sin repetir hechos.
  for (const type of requestedTypes) {
    if (chosen.length >= 5) break;

    const index = available.findIndex((fact) => fact.type === type);

    if (index !== -1) {
      chosen.push(available.splice(index, 1)[0]);
    }
  }

  // Completamos hasta cinco preguntas, priorizando tipos diferentes.
  while (chosen.length < 5 && available.length > 0) {
    const existingTypes = new Set(chosen.map((fact) => fact.type));

    let index = available.findIndex(
      (fact) => !existingTypes.has(fact.type),
    );

    if (index === -1) index = 0;

    chosen.push(available.splice(index, 1)[0]);
  }

  return chosen.map((fact, index) => ({
    id: `${story.id}-${index}-${fact.type}`,
    type: fact.type,
    prompt: fact.prompt,
    options: shuffleOptions(fact.answer, fact.distractors),
    correctAnswer: fact.answer,
    explanation: fact.explanation,
  }));
}
