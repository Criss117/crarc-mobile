import { eq } from "drizzle-orm";

import { findActiveWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-active-workout-session.query";
import { dbConnection } from "@/integrations/db";
import { workoutSession } from "@/integrations/db/schemas";
import { appConfig } from "@/integrations/db/schemas/app-state.schema";

export async function completeWorkoutSessionCommand() {
  const activeSession = await findActiveWorkoutSessionQuery();

  if (!activeSession) throw new Error("No active session");

  await dbConnection.transaction(async (trx) => {
    await trx
      .update(workoutSession)
      .set({
        completed: true,
        endedAt: new Date(),
      })
      .where(eq(workoutSession.id, activeSession.id));

    await trx.update(appConfig).set({ activeWorkoutSessionId: null });
  });
}
