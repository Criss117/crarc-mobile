import { desc, eq, getTableColumns, sql } from "drizzle-orm";

import { mapWorkoutsExercisesSummary } from "@/core/workouts/application/actions/mappers";
import type { WorkoutSummary } from "@/core/workouts/domain/workout.entity";
import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";

export async function findAllWorkoutsQuery(): Promise<WorkoutSummary[]> {
  const allWorkouts = await dbConnection
    .select({
      ...getTableColumns(workout),
      exercises: sql<string>`
          JSON_GROUP_ARRAY(
            JSON_OBJECT(
              'workoutId', ${workoutExercise.workoutId},
              'exerciseId', ${workoutExercise.exerciseId},
              'orderIndex', ${workoutExercise.orderIndex},
              'notes', ${workoutExercise.notes}
            )
          )
        `,
    })
    .from(workout)
    .innerJoin(workoutExercise, eq(workoutExercise.workoutId, workout.id))
    .groupBy(workout.id)
    .orderBy(desc(workout.createdAt))
    .execute();

  return allWorkouts.map((w) => ({
    ...w,
    exercises: mapWorkoutsExercisesSummary(w.exercises),
  }));
}
