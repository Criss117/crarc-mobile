import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { eq, sql } from "drizzle-orm";

import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";
import type { WorkoutExerciseSelect } from "@/integrations/db/schemas/workout.schema";

async function findAllWorkouts() {
  const allWorkouts = await dbConnection
    .select({
      id: workout.id,
      name: workout.name,
      searchName: workout.searchName,
      description: workout.description,
      favorite: workout.favorite,
      isSystem: workout.isSystem,
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
    .execute();

  return allWorkouts.map((w) => ({
    ...w,
    exercises: JSON.parse(w.exercises) as Pick<
      WorkoutExerciseSelect,
      "workoutId" | "exerciseId" | "orderIndex" | "notes"
    >[],
  }));
}

export const findWorkoutsQueryOptions = queryOptions({
  queryKey: ["workouts"],
  queryFn: findAllWorkouts,
});

export type WorkoutSummary = Awaited<
  ReturnType<typeof findAllWorkouts>
>[number];

export function useFindWorkouts() {
  return useSuspenseQuery(findWorkoutsQueryOptions);
}
