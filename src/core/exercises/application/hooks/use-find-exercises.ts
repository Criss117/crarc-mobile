import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { exerciseActions } from "../actions";

type FindExercisesFilters = {
  searchQuery?: string;
  muscleTypeId?: string;
};

export const getExercisesQueryOptions = {
  queryKey: ["exercises"],
  queryFn: exerciseActions.queries.findAllExercises,
};

export function useFindExercises(options?: FindExercisesFilters) {
  const query = useSuspenseQuery(getExercisesQueryOptions);

  const searchQuery = options?.searchQuery ?? "";
  const muscleTypeId = options?.muscleTypeId ?? "all";

  const data = useMemo(() => {
    if (!query.data.length) return [];

    const filteredBySearchQuery = !searchQuery.length
      ? query.data
      : query.data.filter(
          (exercise) =>
            exercise.searchName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.muscles.some((m) =>
              m.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        );

    if (muscleTypeId === "all") return filteredBySearchQuery;

    const filteredByMuscleType = filteredBySearchQuery.filter((exercise) =>
      exercise.muscles.some((m) => m.id === muscleTypeId),
    );

    return filteredByMuscleType;
  }, [query.data, searchQuery, muscleTypeId]);

  return { ...query, data };
}
