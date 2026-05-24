import { eq } from "drizzle-orm";

import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";

type DeleteWorkoutCommand = {
  workoutId: string;
};

export async function deleteWorkoutCommand(cmd: DeleteWorkoutCommand) {
  await dbConnection.transaction(async (tx) => {
    await tx
      .delete(workoutExercise)
      .where(eq(workoutExercise.workoutId, cmd.workoutId));
    await tx.delete(workout).where(eq(workout.id, cmd.workoutId));
  });
}
