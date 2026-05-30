import { findAllMusclesQuery } from "@/core/exercises/application/actions/queries/find-all-muscles.query";
import { findManyExercisesQuery } from "@/core/exercises/application/actions/queries/find-many-exercises.query";
import { findOneExerciseQuery } from "@/core/exercises/application/actions/queries/find-one-exercise.query";

export const exerciseActions = {
  queries: {
    findMany: findManyExercisesQuery,
    findOne: findOneExerciseQuery,
  },
} as const;

export const muscleActions = {
  queries: {
    findAllMuscles: findAllMusclesQuery,
  },
} as const;
