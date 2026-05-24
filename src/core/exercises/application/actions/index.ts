import { findAllExercises } from "./queries/find-all-exercises";
import { findAllMuscles } from "./queries/find-all-muscles";

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
