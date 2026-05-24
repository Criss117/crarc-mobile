import { buildConflictUpdateColumns, type DBConnection } from "..";
import exercisesMusclesData from "../../../assets/data/exercise-muscle.json";
import exercisesData from "../../../assets/data/exercises.json";
import musclesData from "../../../assets/data/muscles.json";

import { exercise, muscle } from "../schemas";
import { appConfig } from "../schemas/app-state.schema";
import {
  ExerciseInsert,
  exerciseMuscle,
  ExerciseMuscleInsert,
} from "../schemas/exercises.schema";

export async function seedExercises(db: DBConnection) {
  const musclesQuery = db
    .insert(muscle)
    .values(musclesData)
    .onConflictDoUpdate({
      target: muscle.id,
      set: buildConflictUpdateColumns(muscle, ["imageUrl", "searchName"]),
    });

  const exercisesQuery = db
    .insert(exercise)
    .values(exercisesData as ExerciseInsert[])
    .onConflictDoUpdate({
      target: exercise.id,
      set: buildConflictUpdateColumns(exercise, [
        "imageUrl",
        "searchName",
        "instructions",
        "difficulty",
        "equipment",
        "favorite",
        "notes",
      ]),
    });

  await Promise.all([musclesQuery, exercisesQuery]);

  const exercisesMusclesQuery = db
    .insert(exerciseMuscle)
    .values(exercisesMusclesData as ExerciseMuscleInsert[])
    .onConflictDoUpdate({
      target: [exerciseMuscle.exerciseId, exerciseMuscle.muscleId],
      set: buildConflictUpdateColumns(exerciseMuscle, ["type"]),
    });

  return exercisesMusclesQuery;
}

export async function seedAppConfig(db: DBConnection) {
  return db.insert(appConfig).values({ id: 1 }).onConflictDoNothing();
}
