import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { workoutActions } from "@/core/workouts/application/actions";

export const findAllWorkoutsQueryOptions = queryOptions({
  queryKey: ["workouts"],
  queryFn: workoutActions.queries.findAll,
});

export const findOneWorkoutQueryOptions = (wotkoutId: string) =>
  queryOptions({
    queryKey: ["workouts", wotkoutId],
    queryFn: () => workoutActions.queries.findOne(wotkoutId),
  });

export function useFindWorkouts() {
  return useSuspenseQuery(findAllWorkoutsQueryOptions);
}

export function useFindOneWorkout(workoutId: string) {
  return useSuspenseQuery(findOneWorkoutQueryOptions(workoutId));
}
