import { eq, inArray } from "drizzle-orm";

import { findOneWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-one-workout-session.query";
import { dbConnection } from "@/integrations/db";
import {
  workoutSession,
  workoutSessionExercise,
  workoutSessionExerciseSet,
} from "@/integrations/db/schemas";
import { appConfig } from "@/integrations/db/schemas/app-state.schema";

interface DeleteWorkoutSessionCommand {
  workoutSessionId: string;
}

export async function deleteWorkoutSessionCommand(
  cmd: DeleteWorkoutSessionCommand,
) {
  const workoutSessionData = await findOneWorkoutSessionQuery(cmd);

  if (!workoutSessionData) throw new Error("Workout not found");

  await dbConnection.transaction(async (tx) => {
    await tx.delete(workoutSessionExerciseSet).where(
      inArray(
        workoutSessionExerciseSet.workoutSessionExerciseId,
        workoutSessionData.exercises.map((we) => we.id),
      ),
    );

    await tx
      .delete(workoutSessionExercise)
      .where(
        eq(workoutSessionExercise.workoutSessionId, workoutSessionData.id),
      );

    await tx
      .delete(workoutSession)
      .where(eq(workoutSession.id, workoutSessionData.id));

    await tx.update(appConfig).set({
      activeWorkoutSessionId: null,
    });
  });
}
