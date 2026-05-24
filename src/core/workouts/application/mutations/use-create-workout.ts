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

interface CreateWorkoutValues {
  values: Omit<WorkoutInsert, "searchName"> & {
    exercises: Omit<WorkoutExerciseInsert, "workoutId">[];
  };
}

async function createWorkout({ values }: CreateWorkoutValues) {
  const exercisesIds = values.exercises.map((e) => e.exerciseId);

  const [{ total }] = await dbConnection
    .select({
      total: count(exercise.id),
    })
    .from(exercise)
    .where(inArray(exercise.id, exercisesIds));

  if (total !== exercisesIds.length)
    throw new Error("Algunos ejercicios no se encuentran");

  const nameExists = await dbConnection
    .select({
      name: workout.name,
    })
    .from(workout)
    .where(eq(workout.name, values.name))
    .limit(1);

  if (nameExists.length) throw new Error("El nombre ya existe");

  await dbConnection.transaction(async (tx) => {
    const [workoutCreated] = await tx
      .insert(workout)
      .values({
        name: values.name,
        description: values.description,
        searchName: normalizeString(values.name),
      })
      .returning({
        id: workout.id,
      });

    await tx.insert(workoutExercise).values(
      values.exercises.map((e) => ({
        ...e,
        workoutId: workoutCreated.id,
      })),
    );
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-workout"],
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries(findWorkoutsQueryOptions);
    },
  });
}
