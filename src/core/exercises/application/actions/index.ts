import { findAllMusclesQuery } from "@/core/exercises/application/actions/queries/find-all-muscles.query";
import { findManyExercisesQuery } from "@/core/exercises/application/actions/queries/find-many-exercises.query";

export const exerciseActions = {
  queries: {
    findManyExercises: findManyExercisesQuery,
  },
};

export const muscleActions = {
  queries: {
    findAllMuscles: findAllMusclesQuery,
  },
};
