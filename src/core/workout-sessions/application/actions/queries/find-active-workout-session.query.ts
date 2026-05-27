import { findAppConfigQuery } from "@/core/profile/application/actions/queries/find-app-config.query";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { findOneWorkoutSessionQuery } from "./find-one-workout-session.query";

export async function findActiveWorkoutSessionQuery(): Promise<WorkoutSessionDetail | null> {
  const appConfig = await findAppConfigQuery();

  if (!appConfig.activeWorkoutSessionId) return null;

  return findOneWorkoutSessionQuery({
    workoutSessionId: appConfig.activeWorkoutSessionId,
  });
}
