import { findAllExercises } from "./queries/find-all-exercises.queries";
import { findAllMuscles } from "./queries/find-all-muscles.queries";

export const exerciseActions = {
  queries: {
    findAllExercises,
  },
};

export const muscleActions = {
  queries: {
    findAllMuscles,
  },
};
