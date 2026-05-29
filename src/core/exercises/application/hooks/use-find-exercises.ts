import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { exerciseActions } from "@/core/exercises/application/actions";

type FindExercisesFilters = {
  filters?: {
    searchQuery?: string;
    muscleTypeId?: string;
  };
};

export function findManyExercisesQueryOptions(options: FindExercisesFilters) {
  const muscleTypeId =
    options.filters?.muscleTypeId !== "all"
      ? options.filters?.muscleTypeId
      : undefined;
  const searchQuery = options.filters?.searchQuery?.toLowerCase();

  return infiniteQueryOptions({
    initialPageParam: {
      page: 0,
    },
    queryKey: ["exercises", muscleTypeId, searchQuery],
    queryFn: ({ pageParam }) =>
      exerciseActions.queries.findManyExercises({
        cursor: {
          limit: 50,
          page: pageParam.page,
        },
        filters: {
          muscleId: muscleTypeId,
          searchQuery,
        },
      }),
    getNextPageParam: (lastPage) =>
      lastPage.nextPage ? { page: lastPage.nextPage } : undefined,
  });
}

export function useFindManyExercises(options: FindExercisesFilters) {
  const { data, ...query } = useSuspenseInfiniteQuery(
    findManyExercisesQueryOptions(options),
  );

  const planedData = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );

  return { ...query, data: planedData };
}
