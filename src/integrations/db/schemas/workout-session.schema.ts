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
import { auditMetadata, weightUnits } from "./shared";
import { workout } from "./workout.schema";

export const workoutSession = sqliteTable(
  "workout_session",
  {
    id: text("id").primaryKey(),
    workoutId: text("workout_id").references(() => workout.id, {
      onDelete: "set null",
    }),
    startedAt: integer("started_at", {
      mode: "timestamp_ms",
    }).notNull(),
    endedAt: integer("ended_at", {
      mode: "timestamp_ms",
    }),
    notes: text("notes"),
    completed: integer("completed", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    ...auditMetadata,
  },
  (t) => [
    check(
      "chk_workout_session_dates",
      sql`${t.endedAt} IS NULL OR ${t.endedAt} > ${t.startedAt}`,
    ),

    index("idx_workout_session_updated_at").on(t.updatedAt),
    index("idx_workout_session_started_at").on(t.startedAt),
    index("idx_workout_session_workout").on(t.workoutId),
  ],
);

export const workoutSessionExercise = sqliteTable(
  "workout_session_exercise",
  {
    id: text("id").primaryKey(),

    workoutSessionId: text("workout_session_id")
      .notNull()
      .references(() => workoutSession.id, {
        onDelete: "cascade",
      }),

    exerciseId: text("exercise_id").references(() => exercise.id, {
      onDelete: "set null",
    }),
    orderIndex: integer("order_index").notNull(),
    notes: text("notes"),
    weightDisplayUnit: text("weight_display_unit", {
      enum: weightUnits,
    }).notNull(),

    ...auditMetadata,
  },
  (t) => [
    uniqueIndex("uq_workout_session_exercise_order").on(
      t.workoutSessionId,
      t.orderIndex,
    ),
    check(
      "chk_workout_session_exercise_order_index",
      sql`${t.orderIndex} >= 0`,
    ),

    index("idx_workout_session_exercise_session").on(t.workoutSessionId),
    index("idx_workout_session_exercise_exercise").on(t.exerciseId),
  ],
);

export const workoutSessionExerciseSet = sqliteTable(
  "workout_session_exercise_set",
  {
    workoutSessionExerciseId: text("workout_session_exercise_id")
      .notNull()
      .references(() => workoutSessionExercise.id, {
        onDelete: "cascade",
      }),

    setIndex: integer("set_index").notNull(),
    reps: integer("reps").notNull(),
    rir: integer("rir"),
    weightInGrams: integer("weight_in_grams").notNull(),
    startedAt: integer("started_at", {
      mode: "timestamp_ms",
    }).notNull(),
    endedAt: integer("ended_at", {
      mode: "timestamp_ms",
    }),
    notes: text("notes"),

    ...auditMetadata,
  },
  (t) => [
    primaryKey({
      columns: [t.workoutSessionExerciseId, t.setIndex],
    }),
    check("chk_workout_set_reps", sql`${t.reps} > 0`),
    check("chk_workout_set_rir", sql`${t.rir} IS NULL OR ${t.rir} >= 0`),
    check("chk_workout_set_weight", sql`${t.weightInGrams} >= 0`),
    check("chk_workout_set_index", sql`${t.setIndex} >= 0`),
    index("idx_workout_set_session_exercise").on(t.workoutSessionExerciseId),
    index("idx_workout_set_weight").on(t.weightInGrams),
  ],
);

export type WorkoutSessionInsert = typeof workoutSession.$inferInsert;
export type WorkoutSessionSelect = typeof workoutSession.$inferSelect;

export type WorkoutSessionExerciseInsert =
  typeof workoutSessionExercise.$inferInsert;
export type WorkoutSessionExerciseSelect =
  typeof workoutSessionExercise.$inferSelect;

export type WorkoutSessionExerciseSetInsert =
  typeof workoutSessionExerciseSet.$inferInsert;
export type WorkoutSessionExerciseSetSelect =
  typeof workoutSessionExerciseSet.$inferSelect;
