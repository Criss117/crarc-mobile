import { workoutSessionActions } from "@/core/workout-sessions/application/actions";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const findActiveWorkoutSessionQueryOptions = queryOptions({
  queryKey: ["active-workout-session"],
  queryFn: workoutSessionActions.queries.findActive,
});

export function useActiveWorkoutSession() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(findActiveWorkoutSessionQueryOptions);

  const completeWorkout = useMutation({
    mutationKey: ["workout-session", "complete"],
    mutationFn: workoutSessionActions.commands.completeWorkoutSession,
  });

  const saveExerciseSet = useMutation({
    mutationKey: ["save-exercise-set"],
    mutationFn: workoutSessionActions.commands.saveExerciseSet,
    onSuccess: () => {
      queryClient.invalidateQueries(findActiveWorkoutSessionQueryOptions);
    },
  });

  const toggleCompleteWorkoutSessionExercise = useMutation({
    mutationKey: ["toggle-complete-workout-session-exercise"],
    mutationFn:
      workoutSessionActions.commands.toggleCompleteWorkoutSessionExercise,
    onSuccess: () => {
      queryClient.invalidateQueries(findActiveWorkoutSessionQueryOptions);
    },
  });

  return {
    data,
    completeWorkout,
    saveExerciseSet,
    toggleCompleteWorkoutSessionExercise,
  };
}
