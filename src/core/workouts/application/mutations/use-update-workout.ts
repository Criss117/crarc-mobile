import { useMutation, useQueryClient } from "@tanstack/react-query";
import { count, eq, inArray } from "drizzle-orm";

import { normalizeString } from "@/core/shared/utils/normalize";
import { findWorkoutsQueryOptions } from "@/core/workouts/application/queries/use-find-workouts";
import { dbConnection } from "@/integrations/db";
import { exercise, workout, workoutExercise } from "@/integrations/db/schemas";
import type {
  WorkoutExerciseInsert,
  WorkoutInsert,
} from "@/integrations/db/schemas/workout.schema";

interface UpdateWorkoutValues {
  values: Omit<WorkoutInsert, "searchName" | "id"> & {
    id: string;
    exercises: Omit<WorkoutExerciseInsert, "workoutId">[];
  };
}

async function updateWorkout({ values }: UpdateWorkoutValues) {
  const exercisesIds = values.exercises.map((e) => e.exerciseId);

  const [{ total }] = await dbConnection
    .select({
      total: count(exercise.id),
    })
    .from(exercise)
    .where(inArray(exercise.id, exercisesIds));

  if (total !== exercisesIds.length)
    throw new Error("Algunos ejercicios no se encuentran");

  const existingWorkout = await dbConnection
    .select({
      id: workout.id,
    })
    .from(workout)
    .where(eq(workout.name, values.name))
    .limit(1)
    .execute();

  if (existingWorkout.length)
    throw new Error("Ya existe un workout con ese nombre");

  await dbConnection.transaction(async (tx) => {
    const [workoutUpdated] = await tx
      .update(workout)
      .set({
        name: values.name,
        description: values.description,
        searchName: normalizeString(values.name),
      })
      .returning({
        id: workout.id,
      });

    await tx
      .delete(workoutExercise)
      .where(eq(workoutExercise.workoutId, workoutUpdated.id));

    await tx.insert(workoutExercise).values(
      values.exercises.map((e) => ({
        ...e,
        workoutId: workoutUpdated.id,
      })),
    );
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-workout"],
    mutationFn: updateWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries(findWorkoutsQueryOptions);
    },
  });
}
