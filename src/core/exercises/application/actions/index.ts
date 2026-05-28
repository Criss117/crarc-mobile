import { findAllExercisesQuery } from "@/core/exercises/application/actions/queries/find-all-exercises.query";
import { findAllMusclesQuery } from "@/core/exercises/application/actions/queries/find-all-muscles.query";

export const exerciseActions = {
  queries: {
    findAllExercises: findAllExercisesQuery,
  },
};

export const muscleActions = {
  queries: {
    findAllMuscles: findAllMusclesQuery,
  },
};
