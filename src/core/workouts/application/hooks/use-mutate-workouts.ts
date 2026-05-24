import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workoutActions } from "@/core/workouts/application/actions";
import { findAllWorkoutsQueryOptions } from "@/core/workouts/application/hooks/use-find-workouts";

export function useMutateWorkouts() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationKey: ["create-workout"],
    mutationFn: workoutActions.commands.create,
    onSuccess: () => {
      queryClient.invalidateQueries(findAllWorkoutsQueryOptions);
    },
  });

  const update = useMutation({
    mutationKey: ["update-workout"],
    mutationFn: workoutActions.commands.update,
    onSuccess: () => {
      queryClient.invalidateQueries(findAllWorkoutsQueryOptions);
    },
  });

  const remove = useMutation({
    mutationKey: ["delete-workout"],
    mutationFn: workoutActions.commands.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(findAllWorkoutsQueryOptions);
    },
  });

  return {
    update,
    create,
    remove,
  };
}
