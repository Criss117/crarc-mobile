import { dbConnection } from "@/integrations/db";
import { exercise } from "@/integrations/db/schemas";
import { eq } from "drizzle-orm";

interface FindOneExerciseQuery {
  exerciseId: string;
}

export async function findOneExerciseQuery(query: FindOneExerciseQuery) {
  const allExercises = await dbConnection
    .select()
    .from(exercise)
    .where(eq(exercise.id, query.exerciseId));

  const data = allExercises.at(0);

  if (!data) return null;

  return data;
}
