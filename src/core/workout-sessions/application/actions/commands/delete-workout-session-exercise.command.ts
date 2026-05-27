import { dbConnection } from "@/integrations/db";
import {
  workoutSessionExercise,
  workoutSessionExerciseSet,
} from "@/integrations/db/schemas";
import { and, eq } from "drizzle-orm";

interface DeleteWorkoutSessionExerciseCommand {
  workoutSessionId: string;
  workoutSessionExerciseId: string;
}

export async function deleteWorkoutSessionExerciseCommand(
  cmd: DeleteWorkoutSessionExerciseCommand,
) {
  await dbConnection.transaction(async (tx) => {
    await tx
      .delete(workoutSessionExerciseSet)
      .where(
        eq(
          workoutSessionExerciseSet.workoutSessionExerciseId,
          cmd.workoutSessionExerciseId,
        ),
      );

    await tx
      .delete(workoutSessionExercise)
      .where(
        and(
          eq(workoutSessionExercise.workoutSessionId, cmd.workoutSessionId),
          eq(workoutSessionExercise.id, cmd.workoutSessionExerciseId),
        ),
      );
  });
}
