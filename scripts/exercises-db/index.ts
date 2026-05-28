import type { Exercise } from "./types";

const EXERCISES_DB_URL =
  "https://raw.githubusercontent.com/Criss117/exercises-dataset/refs/heads/main/data/exercises.json";

const EXERCISES_REPO_MAIN_URL =
  "https://raw.githubusercontent.com/Criss117/exercises-dataset/refs/heads/main/";

const EXERCISES_TYPES_PATH = "./src/integrations/db/schemas/exercise.types.ts";

function dbPath(fileName: "exercises" | "muscles" | "exercise-muscle") {
  return `./src/assets/data/${fileName}.json`;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

async function saveData() {
  const res = await fetch(EXERCISES_DB_URL);

  if (!res.ok) throw new Error("Failed to fetch data");

  const data = (await res.json()) as Exercise[];

  const muscleGroup = new Set<string>();
  const categories = new Set<string>();
  const equipment = new Set<string>();
  const target = new Set<string>();
  const exerciseMuscles: {
    exerciseId: string;
    muscleId: string;
    type: "primary" | "secondary";
  }[] = [];

  const exercises = data.map((exercise) => {
    muscleGroup.add(exercise.muscle_group);
    categories.add(exercise.category);
    equipment.add(exercise.equipment);
    target.add(exercise.target);

    exerciseMuscles.push({
      exerciseId: slugify(exercise.name),
      muscleId: slugify(exercise.muscle_group),
      type: "primary",
    });

    exercise.secondary_muscles.forEach((muscle) => {
      exerciseMuscles.push({
        exerciseId: slugify(exercise.name),
        muscleId: slugify(muscle),
        type: "secondary",
      });
    });

    return {
      id: slugify(exercise.name),
      name: exercise.name,
      searchName: exercise.name,
      instructions: exercise.instructions.en,
      instructionsStep: exercise.instruction_steps.en,
      image: EXERCISES_REPO_MAIN_URL + exercise.image,
      gifUrl: EXERCISES_REPO_MAIN_URL + exercise.gif_url,
      equipment: exercise.equipment,
      target: exercise.target,
      category: exercise.category,
    };
  });

  Bun.write(
    dbPath("muscles"),
    JSON.stringify(
      Array.from(muscleGroup).map((m) => ({
        id: slugify(m),
        name: m,
        searchName: m,
        imageUrl: null,
      })),
    ),
  );

  Bun.write(dbPath("exercise-muscle"), JSON.stringify(exerciseMuscles));

  Bun.write(dbPath("exercises"), JSON.stringify(exercises));

  Bun.write(
    EXERCISES_TYPES_PATH,
    `export const categorieTypes = [${Array.from(categories).map(
      (c) => `"${c}"`,
    )}] as const;

    export type CategorieTypes = (typeof categorieTypes)[number];
    
    export const equipmentTypes = [${Array.from(equipment).map(
      (c) => `"${c}"`,
    )}] as const;

    export type EquipmentTypes = (typeof equipmentTypes)[number];
    
    export const targetTypes = [${Array.from(target).map(
      (c) => `"${c}"`,
    )}] as const;

    export type TargetTypes = (typeof targetTypes)[number];

    export const muscleExerciseTypes = ["primary","secondary"] as const;

    export type MuscleExerciseType = (typeof muscleExerciseTypes)[number];
    `,
  );
}

saveData();
