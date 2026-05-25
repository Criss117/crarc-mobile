import { dbConnection } from "@/integrations/db";
import { workoutSessionExerciseSet } from "@/integrations/db/schemas";
import { findActiveWorkoutSessionQuery } from "../queries/find-active-workout-session.query";

type SaveExerciseSetCommand = {
  workoutSessionExerciseId: string;
  setIndex: number;
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

  await dbConnection
    .insert(workoutSessionExerciseSet)
    .values({
      workoutSessionExerciseId: cmd.workoutSessionExerciseId,
      setIndex: cmd.setIndex,
      reps: cmd.reps,
      rir: cmd.rir,
      weightInGrams: weightInGrams,
      startedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        workoutSessionExerciseSet.setIndex,
        workoutSessionExerciseSet.workoutSessionExerciseId,
      ],
      set: {
        reps: cmd.reps,
        rir: cmd.rir,
        weightInGrams: weightInGrams,
        endedAt: new Date(),
      },
    });
}
