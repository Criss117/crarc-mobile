import { count, inArray } from "drizzle-orm";

import { err, ok } from "@/core/shared/utils/trycatch";
import { dbConnection } from "@/integrations/db";
import { exercise } from "@/integrations/db/schemas";

export async function ensureExercisesExists(exercisesIds: string[]) {
  const [{ total }] = await dbConnection
    .select({
      total: count(exercise.id),
    })
    .from(exercise)
    .where(inArray(exercise.id, exercisesIds));

  if (total !== exercisesIds.length)
    return err(new Error("Algunos ejercicios no se encuentran"));

  return ok(null);
}
