import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exerciseActions } from "../actions";

export function useMutateExercises() {
  const queryClient = useQueryClient();

  const setFavorite = useMutation({
    mutationKey: ["setFavorite"],
    mutationFn: exerciseActions.commands.setFavorite,
  });

  return {
    setFavorite,
  };
}
