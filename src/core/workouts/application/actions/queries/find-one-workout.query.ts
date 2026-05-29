import { eq, getTableColumns, sql } from "drizzle-orm";

import type { WorkoutDetail } from "@/core/workouts/domain/workout.entity";
import { dbConnection } from "@/integrations/db";
import {
  exercise,
  exerciseMuscle,
  muscle,
  workout,
  workoutExercise,
} from "@/integrations/db/schemas";

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

  const allWorkoutExercises = await dbConnection
    .select({
      ...getTableColumns(exercise),
      orderIndex: workoutExercise.orderIndex,
      muscles: sql<string>`
        COALESCE(
          JSON_GROUP_ARRAY(
            JSON_OBJECT(
              'id', ${muscle.id},
              'name', ${muscle.name},
              'searchName', ${muscle.searchName},
              'imageUrl', ${muscle.imageUrl},
              'type', ${exerciseMuscle.type}
            )
          ) FILTER (WHERE ${muscle.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(workoutExercise)
    .innerJoin(exercise, eq(exercise.id, workoutExercise.exerciseId))
    .innerJoin(exerciseMuscle, eq(exerciseMuscle.exerciseId, exercise.id))
    .innerJoin(muscle, eq(muscle.id, exerciseMuscle.muscleId))
    .where(eq(workoutExercise.workoutId, workoutId))
    .execute();

  return {
    ...data,
    exercises: allWorkoutExercises.map((e) => ({
      ...e,
      muscles: JSON.parse(
        e.muscles,
      ) as WorkoutDetail["exercises"][number]["muscles"],
    })),
  };
}
