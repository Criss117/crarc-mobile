import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { muscleActions } from "@/core/exercises/application/actions";

export const findAllMusclesQueryOptions = queryOptions({
  queryKey: ["muscles"],
  queryFn: muscleActions.queries.findAllMuscles,
});

export function useFindMuscles() {
  return useSuspenseQuery(findAllMusclesQueryOptions);
}
