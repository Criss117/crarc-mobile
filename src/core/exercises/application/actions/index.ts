import { findAllMusclesQuery } from "@/core/exercises/application/actions/queries/find-all-muscles.query";
import { findManyExercisesQuery } from "@/core/exercises/application/actions/queries/find-many-exercises.query";
import { findOneExerciseQuery } from "@/core/exercises/application/actions/queries/find-one-exercise.query";
import { setFavoriteExerciseCommand } from "@/core/exercises/application/actions/queries/set-favorite-exercise.command";

export const exerciseActions = {
  queries: {
    findMany: findManyExercisesQuery,
    findOne: findOneExerciseQuery,
  },
  commands: {
    setFavorite: setFavoriteExerciseCommand,
  },
} as const;

export const muscleActions = {
  queries: {
    findAllMuscles: findAllMusclesQuery,
  },
} as const;
