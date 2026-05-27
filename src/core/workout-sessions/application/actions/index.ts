import { completeWorkoutSessionCommand } from "@/core/workout-sessions/application/actions/commands/complete-workout-session.command";
import { initWorkoutSessionCommand } from "@/core/workout-sessions/application/actions/commands/init-workout-session.command";
import { saveExerciseSetCommand } from "@/core/workout-sessions/application/actions/commands/save-exercise-set.command";
import { toggleCompleteWorkoutSessionExerciseCommand } from "@/core/workout-sessions/application/actions/commands/toggle-complete-workout-session-exercise.command";
import { findActiveWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-active-workout-session.query";
import { findAllWorkoutSessionsQuery } from "@/core/workout-sessions/application/actions/queries/find-all-workout-sessions.query";
import { findOneWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-one-workout-session.query";

export const workoutSessionActions = {
  commands: {
    init: initWorkoutSessionCommand,
    saveExerciseSet: saveExerciseSetCommand,
    toggleCompleteWorkoutSessionExercise:
      toggleCompleteWorkoutSessionExerciseCommand,
    completeWorkoutSession: completeWorkoutSessionCommand,
  },
  queries: {
    findAll: findAllWorkoutSessionsQuery,
    findActive: findActiveWorkoutSessionQuery,
    findOne: findOneWorkoutSessionQuery,
  },
};
