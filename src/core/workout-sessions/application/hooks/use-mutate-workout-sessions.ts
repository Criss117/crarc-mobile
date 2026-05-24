import { useMutation, useQueryClient } from "@tanstack/react-query";

import { findAppConfigQueryOptions } from "@/core/profile/application/hooks/use-app-config";
import { workoutSessionActions } from "@/core/workout-sessions/application/actions";
import { findAllWorkoutSessionsQueryOptions } from "./use-find-workout-sessions";

export function useMutateWorkoutSessions() {
  const queryClient = useQueryClient();

  const init = useMutation({
    mutationKey: ["init-workout-session"],
    mutationFn: workoutSessionActions.commands.init,
    onSuccess: () => {
      queryClient.invalidateQueries(findAppConfigQueryOptions);
      queryClient.invalidateQueries(findAllWorkoutSessionsQueryOptions);
    },
  });

  return {
    init,
  };
}
