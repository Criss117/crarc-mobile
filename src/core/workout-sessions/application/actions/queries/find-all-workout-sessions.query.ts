import { count, desc, eq, getTableColumns } from "drizzle-orm";

import { WorkoutSessionSummary } from "@/core/workout-sessions/domain/workout-session.entity";
import { dbConnection } from "@/integrations/db";
import {
  workoutSession,
  workoutSessionExercise,
} from "@/integrations/db/schemas";

export async function findAllWorkoutSessionsQuery(): Promise<
  WorkoutSessionSummary[]
> {
  const allWorkoutSessions = await dbConnection
    .select({
      ...getTableColumns(workoutSession),
      totalExercises: count(workoutSessionExercise.id),
    })
    .from(workoutSession)
    .leftJoin(
      workoutSessionExercise,
      eq(workoutSessionExercise.workoutSessionId, workoutSession.id),
    )
    .groupBy(workoutSession.id)
    .orderBy(desc(workoutSession.startedAt))
    .execute();

  return allWorkoutSessions;
}
