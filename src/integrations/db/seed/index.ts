import { buildConflictUpdateColumns, type DBConnection } from "..";
import exercisesMusclesData from "../../../assets/data/exercise-muscle.json";
import exercisesData from "../../../assets/data/exercises.json";
import musclesData from "../../../assets/data/muscles.json";

import { exercise, muscle } from "../schemas";
import { appConfig } from "../schemas/app-state.schema";
import {
  type ExerciseInsert,
  exerciseMuscle,
  type ExerciseMuscleInsert,
} from "../schemas/exercises.schema";

export async function seedExercises(db: DBConnection) {
  const musclesQuery = db
    .insert(muscle)
    .values(
      musclesData.map((m) => ({
        id: m.id,
        name: m.name,
        searchName: m.searchName,
      })),
    )
    .onConflictDoUpdate({
      target: muscle.id,
      set: buildConflictUpdateColumns(muscle, ["imageUrl", "searchName"]),
    });

  const exercisesToInsert = exercisesData.map((e) => ({
    id: e.id,
    name: e.name,
    searchName: e.searchName,
    image: e.image,
    gifUrl: e.gifUrl,
    instructions: e.instructions,
    instructionsStep: e.instructionsStep,
    category: e.category as ExerciseInsert["category"],
    equipment: e.equipment as ExerciseInsert["equipment"],
    target: e.target as ExerciseInsert["target"],
  })) satisfies ExerciseInsert[];

  const exercisesQuery = db
    .insert(exercise)
    .values(exercisesToInsert)
    .onConflictDoUpdate({
      target: exercise.id,
      set: buildConflictUpdateColumns(exercise, [
        "name",
        "searchName",
        "image",
        "gifUrl",
        "instructions",
        "instructionsStep",
        "category",
        "equipment",
        "target",
      ]),
    });

  await Promise.all([musclesQuery, exercisesQuery]);

  const exercisesMusclesQuery = db
    .insert(exerciseMuscle)
    .values(
      exercisesMusclesData.map((em) => ({
        exerciseId: em.exerciseId,
        muscleId: em.muscleId,
        type: em.type as ExerciseMuscleInsert["type"],
      })),
    )
    .onConflictDoUpdate({
      target: [exerciseMuscle.exerciseId, exerciseMuscle.muscleId],
      set: buildConflictUpdateColumns(exerciseMuscle, ["type"]),
    })
    .returning();

  return exercisesMusclesQuery;
}

export async function seedAppConfig(db: DBConnection) {
  return db.insert(appConfig).values({ id: 1 }).onConflictDoNothing();
}
