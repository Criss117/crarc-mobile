import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { workoutSession } from "./workout-session.schema";

export const appConfig = sqliteTable("app_config", {
  id: integer("id").primaryKey().default(1),
  theme: text("theme", {
    enum: ["light", "dark"],
  })
    .notNull()
    .default("light"),
  defaultWeightUnit: text("default_weight_unit", {
    enum: ["kg", "lb"],
  })
    .default("kg")
    .notNull(),

  activeWorkoutSessionId: text("active_workout_session_id").references(
    () => workoutSession.id,
    {
      onDelete: "set null",
    },
  ),
});

export type AppConfigSelect = typeof appConfig.$inferSelect;
export type AppConfigInsert = typeof appConfig.$inferInsert;
