import { createWorkoutCommand } from "@/core/workouts/application/actions/commands/create-workout.command";
import { updateWorkoutCommand } from "@/core/workouts/application/actions/commands/update-workout.command";
import { findAllWorkoutsQuery } from "@/core/workouts/application/actions/queries/find-all-workouts.query";
import { findOneWorkoutQuery } from "@/core/workouts/application/actions/queries/find-one-workout.query";
import { deleteWorkoutCommand } from "./commands/delete-workout.command";

export const workoutActions = {
  queries: {
    findAll: findAllWorkoutsQuery,
    findOne: findOneWorkoutQuery,
  },
  commands: {
    create: createWorkoutCommand,
    update: updateWorkoutCommand,
    delete: deleteWorkoutCommand,
  },
};
