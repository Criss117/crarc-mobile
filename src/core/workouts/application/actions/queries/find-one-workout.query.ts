import { eq } from "drizzle-orm";

import type { WorkoutDetail } from "@/core/workouts/domain/workout.entity";
import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";

export async function findOneWorkoutQuery(
  workoutId: string,
): Promise<WorkoutDetail | null> {
  const allWorkouts = await dbConnection
    .select()
    .from(workout)
    .where(eq(workout.id, workoutId))
    .limit(1)
    .execute();

  const data = allWorkouts.at(0);

  if (!data) return null;

  const exercises = await dbConnection
    .select()
    .from(workoutExercise)
    .where(eq(workoutExercise.workoutId, workoutId))
    .execute();

  return {
    ...data,
    exercises,
  };
}
