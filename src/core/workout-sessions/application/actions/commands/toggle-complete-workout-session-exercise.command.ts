import { and, eq } from "drizzle-orm";

import { findActiveWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-active-workout-session.query";
import { dbConnection } from "@/integrations/db";
import { workoutSessionExercise } from "@/integrations/db/schemas";

type ToggleCompleteWorkoutSessionExerciseCommand = {
  workoutSessionExerciseId: string;
};

export async function toggleCompleteWorkoutSessionExerciseCommand(
  cmd: ToggleCompleteWorkoutSessionExerciseCommand,
) {
  const activeSession = await findActiveWorkoutSessionQuery();

  if (!activeSession) throw new Error("No active session");

  const currentExercise = activeSession.exercises.find(
    (e) => e.id === cmd.workoutSessionExerciseId,
  );

  if (!currentExercise) throw new Error("Exercise not found");

  await dbConnection
    .update(workoutSessionExercise)
    .set({
      completed: !currentExercise.completed,
    })
    .where(
      and(
        eq(workoutSessionExercise.workoutSessionId, activeSession.id),
        eq(workoutSessionExercise.id, cmd.workoutSessionExerciseId),
      ),
    );
}
