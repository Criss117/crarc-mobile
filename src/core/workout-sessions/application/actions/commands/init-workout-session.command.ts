import { findAppConfigQuery } from "@/core/profile/application/actions/queries/find-app-config.query";
import { findOneWorkoutQuery } from "@/core/workouts/application/actions/queries/find-one-workout.query";
import { dbConnection } from "@/integrations/db";
import {
  workoutSession,
  workoutSessionExercise,
} from "@/integrations/db/schemas";
import { appConfig } from "@/integrations/db/schemas/app-state.schema";
import type { WorkoutSessionExerciseInsert } from "@/integrations/db/schemas/workout-session.schema";

type InitWorkoutSessionCommand = {
  workoutId: string;
};

export async function initWorkoutSessionCommand(
  cmd: InitWorkoutSessionCommand,
) {
  const workoutData = await findOneWorkoutQuery(cmd.workoutId);

  if (!workoutData) throw new Error("Workout not found");

  const appConfigData = await findAppConfigQuery();

  if (appConfigData.activeWorkoutSessionId !== null)
    throw new Error("Session already active");

  const sessionCreated = await dbConnection.transaction(async (tx) => {
    const [sessionCreated] = await tx
      .insert(workoutSession)
      .values({
        startedAt: new Date(),
        workoutId: workoutData.id,
      })
      .returning({
        id: workoutSession.id,
      })
      .execute();

    await tx
      .insert(workoutSessionExercise)
      .values(
        workoutData.exercises.map((e) => ({
          orderIndex: e.orderIndex,
          weightDisplayUnit: appConfigData.defaultWeightUnit,
          workoutSessionId: sessionCreated.id,
          exerciseId: e.id,
        })) satisfies WorkoutSessionExerciseInsert[],
      )
      .execute();

    await tx
      .update(appConfig)
      .set({ activeWorkoutSessionId: sessionCreated.id });

    return sessionCreated;
  });

  return sessionCreated;
}
