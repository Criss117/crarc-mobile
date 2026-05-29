import { count, desc, eq, getTableColumns } from "drizzle-orm";

import type { WorkoutSummary } from "@/core/workouts/domain/workout.entity";
import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";

export async function findAllWorkoutsQuery(): Promise<WorkoutSummary[]> {
  const allWorkouts = await dbConnection
    .select({
      ...getTableColumns(workout),
      totalExercises: count(workoutExercise),
    })
    .from(workout)
    .innerJoin(workoutExercise, eq(workoutExercise.workoutId, workout.id))
    .groupBy(workout.id)
    .orderBy(desc(workout.createdAt))
    .execute();

  return allWorkouts;
}
