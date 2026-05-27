import { dbConnection } from "@/integrations/db";
import { workoutSessionExerciseSet } from "@/integrations/db/schemas";
import { and, eq } from "drizzle-orm";
import { findActiveWorkoutSessionQuery } from "../queries/find-active-workout-session.query";

type SaveExerciseSetCommand = {
  setId?: string;
  workoutSessionExerciseId: string;
  weightInUnits: number;
  reps: number;
  rir: number;
};

export async function saveExerciseSetCommand(cmd: SaveExerciseSetCommand) {
  const activeSession = await findActiveWorkoutSessionQuery();

  if (!activeSession) throw new Error("No active session");

  const currentExercise = activeSession.exercises.find(
    (e) => e.id === cmd.workoutSessionExerciseId,
  );

  if (!currentExercise) throw new Error("Exercise not found");

  if (currentExercise.completed) throw new Error("Exercise already completed");

  const weightInGrams =
    cmd.weightInUnits *
    (currentExercise.weightDisplayUnit === "kg" ? 1000 : 453.6);

  if (cmd.setId) {
    await dbConnection
      .update(workoutSessionExerciseSet)
      .set({
        reps: cmd.reps,
        rir: cmd.rir,
        weightInGrams: weightInGrams,
      })
      .where(
        and(
          eq(
            workoutSessionExerciseSet.workoutSessionExerciseId,
            cmd.workoutSessionExerciseId,
          ),
          eq(workoutSessionExerciseSet.id, cmd.setId),
        ),
      );

    return;
  }

  await dbConnection.insert(workoutSessionExerciseSet).values({
    workoutSessionExerciseId: cmd.workoutSessionExerciseId,
    reps: cmd.reps,
    rir: cmd.rir,
    weightInGrams: weightInGrams,
  });
}
