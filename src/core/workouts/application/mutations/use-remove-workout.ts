import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

import { findWorkoutsQueryOptions } from "@/core/workouts/application/queries/use-find-workouts";
import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";

async function removeWorkout(workoutId: string) {
  await dbConnection.transaction(async (tx) => {
    await tx
      .delete(workoutExercise)
      .where(eq(workoutExercise.workoutId, workoutId));

    await tx.delete(workout).where(eq(workout.id, workoutId));
  });
}

export function useRemoveWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["remove-workout"],
    mutationFn: removeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries(findWorkoutsQueryOptions);
    },
  });
}
