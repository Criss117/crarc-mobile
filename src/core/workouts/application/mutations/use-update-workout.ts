import { useMutation, useQueryClient } from "@tanstack/react-query";
import { and, count, eq, inArray, not } from "drizzle-orm";

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

  const existisWorkout = await dbConnection
    .select({
      name: workout.name,
    })
    .from(workout)
    .where(eq(workout.id, values.id))
    .limit(1);

  if (!existisWorkout.length) throw new Error("El workout no existe");

  if (existisWorkout[0].name !== values.name) {
    const nameExists = await dbConnection
      .select({
        name: workout.name,
      })
      .from(workout)
      .where(and(not(eq(workout.id, values.id)), eq(workout.name, values.name)))
      .limit(1);

    if (nameExists.length) throw new Error("El nombre ya existe");
  }

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
