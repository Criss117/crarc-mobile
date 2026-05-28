// db/schema/exercise.schema.ts
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import {
  categorieTypes,
  equipmentTypes,
  muscleExerciseTypes,
  targetTypes,
} from "./exercise.types";
import { auditMetadata } from "./shared";

export const muscle = sqliteTable(
  "muscle",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    searchName: text("search_name").notNull(),
    imageUrl: text("image_url"),
    ...auditMetadata,
  },
  (t) => [
    uniqueIndex("uq_muscle_name").on(t.name),
    index("idx_muscle_search_name").on(t.searchName),
  ],
);

export const exercise = sqliteTable(
  "exercise",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    searchName: text("search_name").notNull(),

    image: text("image"),
    gifUrl: text("gif_url"),

    instructions: text("instructions").notNull(),
    instructionsStep: text("instructions_step", {
      mode: "json",
    })
      .notNull()
      .$type<string[]>(),

    category: text("category", {
      enum: categorieTypes,
    }).notNull(),
    equipment: text("equipment", {
      enum: equipmentTypes,
    }).notNull(),
    target: text("target", {
      enum: targetTypes,
    }).notNull(),

    favorite: integer("favorite", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
    notes: text("notes"),

    ...auditMetadata,
  },
  (t) => [
    uniqueIndex("uq_exercise_name").on(t.name),
    index("idx_exercise_search_name").on(t.searchName),
    index("idx_exercise_favorite").on(t.favorite),
  ],
);

export const exerciseMuscle = sqliteTable(
  "exercise_muscle",
  {
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercise.id, {
        onDelete: "cascade",
      }),
    muscleId: text("muscle_id")
      .notNull()
      .references(() => muscle.id, {
        onDelete: "cascade",
      }),
    type: text("type", {
      enum: muscleExerciseTypes,
    }).notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.exerciseId, t.muscleId, t.type],
    }),
  ],
);

export type ExerciseMuscleInsert = typeof exerciseMuscle.$inferInsert;
export type ExerciseMuscleSelect = typeof exerciseMuscle.$inferSelect;

export type MuscleInsert = typeof muscle.$inferInsert;
export type MuscleSelect = typeof muscle.$inferSelect;

export type ExerciseInsert = typeof exercise.$inferInsert;
export type ExerciseSelect = typeof exercise.$inferSelect;
