import { initWorkoutSessionCommand } from "@/core/workout-sessions/application/actions/commands/init-workout-session.command";
import { findActiveWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-active-workout-session.query";
import { findAllWorkoutSessionsQuery } from "@/core/workout-sessions/application/actions/queries/find-all-workout-sessions.query";

export const workoutSessionActions = {
  commands: {
    init: initWorkoutSessionCommand,
  },
  queries: {
    findAll: findAllWorkoutSessionsQuery,
    findActive: findActiveWorkoutSessionQuery,
  },
};
