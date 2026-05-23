// db/schema/shared.ts
import { integer, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export function uuid(name = "id") {
  return text(name)
    .primaryKey()
    .$defaultFn(() => v7());
}

export const auditMetadata = {
  createdAt: integer("created_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .$defaultFn(() => new Date()),

  deletedAt: integer("deleted_at", {
    mode: "timestamp_ms",
  }),
};

export const muscleExerciseTypes = [
  "primary",
  "secondary",
  "stabilizer",
] as const;

export type MuscleExerciseType = (typeof muscleExerciseTypes)[number];

export const exerciseDifficulty = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type ExerciseDifficulty = (typeof exerciseDifficulty)[number];

export const equipmentTypes = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "smith_machine",
  "kettlebell",
  "band",
  "other",
] as const;

export type EquipmentType = (typeof equipmentTypes)[number];

export const weightUnits = ["kg", "lb"] as const;

export type WeightUnit = (typeof weightUnits)[number];
