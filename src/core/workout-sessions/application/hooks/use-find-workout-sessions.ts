import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { workoutSessionActions } from "@/core/workout-sessions/application/actions";

export const findAllWorkoutSessionsQueryOptions = queryOptions({
  queryKey: ["workout-sessions"],
  queryFn: workoutSessionActions.queries.findAll,
});

export function useFindAllWorkoutSessions() {
  return useSuspenseQuery(findAllWorkoutSessionsQueryOptions);
}
