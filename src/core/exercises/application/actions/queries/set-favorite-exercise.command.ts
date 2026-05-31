import { eq } from "drizzle-orm";

import { dbConnection } from "@/integrations/db";
import { exercise } from "@/integrations/db/schemas";

export type SetFavoriteExerciseCommand = {
  exerciseId: string;
};

export async function setFavoriteExerciseCommand(
  cmd: SetFavoriteExerciseCommand,
) {
  const exerciseData = await dbConnection
    .select({
      favorite: exercise.favorite,
    })
    .from(exercise)
    .where(eq(exercise.id, cmd.exerciseId));

  const data = exerciseData.at(0);

  if (!data) throw new Error("Exercise not found");

  await dbConnection
    .update(exercise)
    .set({ favorite: !data.favorite })
    .where(eq(exercise.id, cmd.exerciseId));
}
