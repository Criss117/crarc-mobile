import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { exercise } from "./exercises.schema";
import { auditMetadata } from "./shared";

export const workout = sqliteTable(
  "workout",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    searchName: text("search_name").notNull(),
    description: text("description"),
    favorite: integer("favorite", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
    isSystem: integer("is_system", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    ...auditMetadata,
  },
  (t) => [
    uniqueIndex("uq_workout_name").on(t.name),

    index("idx_workout_updated_at").on(t.updatedAt),
  ],
);

export const workoutExercise = sqliteTable(
  "workout_exercise",
  {
    workoutId: text("workout_id")
      .notNull()
      .references(() => workout.id, {
        onDelete: "cascade",
      }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercise.id, {
        onDelete: "cascade",
      }),
    orderIndex: integer("order_index").notNull(),
    notes: text("notes"),
    ...auditMetadata,
  },
  (t) => [
    primaryKey({
      columns: [t.workoutId, t.exerciseId],
    }),
    check("chk_workout_exercise_order_index", sql`${t.orderIndex} >= 0`),
    uniqueIndex("uq_workout_order_index").on(t.workoutId, t.orderIndex),
    index("idx_workout_exercise_workout").on(t.workoutId),
    index("idx_workout_exercise_exercise").on(t.exerciseId),
  ],
);

export type WorkoutInsert = typeof workout.$inferInsert;
export type WorkoutSelect = typeof workout.$inferSelect;

export type WorkoutExerciseInsert = typeof workoutExercise.$inferInsert;
export type WorkoutExerciseSelect = typeof workoutExercise.$inferSelect;
