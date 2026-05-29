import { findAllExercisesQuery } from "@/core/exercises/application/actions/queries/find-all-exercises.query";
import { findAllMusclesQuery } from "@/core/exercises/application/actions/queries/find-all-muscles.query";
import { findManyExercisesQuery } from "./queries/find-many-exercises.query";

export const exerciseActions = {
  queries: {
    findAllExercises: findAllExercisesQuery,
    findManyExercises: findManyExercisesQuery,
  },
};

export const muscleActions = {
  queries: {
    findAllMuscles: findAllMusclesQuery,
  },
};
