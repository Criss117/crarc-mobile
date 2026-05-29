import { desc, eq, getTableColumns, inArray } from "drizzle-orm";

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
    })
    .from(workoutExercise)
    .innerJoin(exercise, eq(exercise.id, workoutExercise.exerciseId))
    .where(eq(workoutExercise.workoutId, workoutId))
    .orderBy(desc(workoutExercise.orderIndex))
    .execute();

  const allMuscles = await dbConnection
    .select({
      id: muscle.id,
      name: muscle.name,
      searchName: muscle.searchName,
      imageUrl: muscle.imageUrl,
      exerciseId: exerciseMuscle.exerciseId,
      type: exerciseMuscle.type,
    })
    .from(exerciseMuscle)
    .innerJoin(muscle, eq(muscle.id, exerciseMuscle.muscleId))
    .where(
      inArray(
        exerciseMuscle.exerciseId,
        allWorkoutExercises.map((e) => e.id),
      ),
    )
    .execute();

  return {
    ...data,
    exercises: allWorkoutExercises.map((e) => ({
      ...e,
      muscles: allMuscles.filter((m) => m.exerciseId === e.id),
    })),
  };
}
