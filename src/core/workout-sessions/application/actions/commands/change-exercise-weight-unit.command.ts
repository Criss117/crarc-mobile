import { findOneWorkoutSessionQuery } from "@/core/workout-sessions/application/actions/queries/find-one-workout-session.query";
import { dbConnection } from "@/integrations/db";
import { workoutSessionExercise } from "@/integrations/db/schemas";
import { and, eq } from "drizzle-orm";

interface ChangeExerciseWeightUnitCommand {
  workoutSessionExerciseId: string;
  workoutSessionId: string;
  newWeightUnit: "kg" | "lb";
}

export async function changeExerciseWeightUnitCommand(
  cmd: ChangeExerciseWeightUnitCommand,
) {
  const workoutSession = await findOneWorkoutSessionQuery({
    workoutSessionId: cmd.workoutSessionId,
  });

  if (!workoutSession) throw new Error("Workout session not found");

  const exercise = workoutSession.exercises.find(
    (e) => e.id === cmd.workoutSessionExerciseId,
  );

  if (!exercise) throw new Error("Exercise not found");

  if (exercise.weightDisplayUnit === cmd.newWeightUnit) return;

  await dbConnection
    .update(workoutSessionExercise)
    .set({
      weightDisplayUnit: cmd.newWeightUnit,
    })
    .where(
      and(
        eq(workoutSessionExercise.id, cmd.workoutSessionExerciseId),
        eq(workoutSessionExercise.workoutSessionId, cmd.workoutSessionId),
      ),
    );
}
