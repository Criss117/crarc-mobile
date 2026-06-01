import { count } from "drizzle-orm";

import { dbConnection } from "@/integrations/db";
import { workout, workoutSession } from "@/integrations/db/schemas";
import { appConfig } from "@/integrations/db/schemas/app-state.schema";

export async function findAppConfigQuery() {
  const [data] = await dbConnection.select().from(appConfig);

  const [{ total: totalWorkouts }] = await dbConnection
    .select({
      total: count(workout.id),
    })
    .from(workout);

  const [{ total: totalWorkoutSession }] = await dbConnection
    .select({
      total: count(workoutSession.id),
    })
    .from(workoutSession);

  return { ...data, totalWorkouts, totalWorkoutSession };
}
