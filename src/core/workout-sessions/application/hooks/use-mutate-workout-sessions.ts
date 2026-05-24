import { useMutation } from "@tanstack/react-query";

import { workoutSessionActions } from "@/core/workout-sessions/application/actions";

export function useMutateWorkoutSessions() {
  const init = useMutation({
    mutationKey: ["init-workout-session"],
    mutationFn: workoutSessionActions.commands.init,
  });

  return {
    init,
  };
}
