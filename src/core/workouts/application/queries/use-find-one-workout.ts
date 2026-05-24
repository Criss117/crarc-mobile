import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { eq, sql } from "drizzle-orm";

import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";
import type { WorkoutExerciseSelect } from "@/integrations/db/schemas/workout.schema";

async function findOneWorkout(wotkoutId: string) {
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
    .where(eq(workout.id, wotkoutId))
    .limit(1)
    .execute();

  const data = allWorkouts.at(0);

  if (!data) return null;

  return {
    ...data,
    exercises: JSON.parse(data.exercises) as Pick<
      WorkoutExerciseSelect,
      "workoutId" | "exerciseId" | "orderIndex" | "notes"
    >[],
  };
}

export function findOneWorkoutQueryOptions(wotkoutId: string) {
  return queryOptions({
    queryKey: ["workouts", wotkoutId],
    queryFn: () => findOneWorkout(wotkoutId),
  });
}

export type WorkoutDetail = NonNullable<
  Awaited<ReturnType<typeof findOneWorkout>>
>;

export function useFindOneWorkout(workoutId: string) {
  return useSuspenseQuery(findOneWorkoutQueryOptions(workoutId));
}
