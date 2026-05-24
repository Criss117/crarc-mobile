import { z } from "zod";

import type { WorkoutSummary } from "@/core/workouts/domain/workout.entity";

const workoutsExercisesSummarySchema = z.array(
  z.object({
    workoutId: z.string(),
    exerciseId: z.string(),
    orderIndex: z.number(),
    notes: z.string().nullable(),
  }),
);

export function mapWorkoutsExercisesSummary(
  exercises: string,
): WorkoutSummary["exercises"] {
  const jsonData = JSON.parse(exercises);

  return workoutsExercisesSummarySchema.parse(jsonData);
}
