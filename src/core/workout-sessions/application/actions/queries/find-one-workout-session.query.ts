import { eq, getTableColumns, inArray } from "drizzle-orm";

import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { dbConnection } from "@/integrations/db";
import {
  exercise,
  workoutSession,
  workoutSessionExercise,
  workoutSessionExerciseSet,
} from "@/integrations/db/schemas";

type Query = {
  workoutSessionId: string;
};

export async function findOneWorkoutSessionQuery(
  query: Query,
): Promise<WorkoutSessionDetail | null> {
  const allSessions = await dbConnection
    .select()
    .from(workoutSession)
    .where(eq(workoutSession.id, query.workoutSessionId));

  const workoutSessionData = allSessions.at(0);

  if (!workoutSessionData) return null;

  const allWorkoutSessionExercises = await dbConnection
    .select({
      ...getTableColumns(workoutSessionExercise),
      name: exercise.name,
    })
    .from(workoutSessionExercise)
    .leftJoin(exercise, eq(exercise.id, workoutSessionExercise.exerciseId))
    .where(eq(workoutSessionExercise.workoutSessionId, workoutSessionData.id));

  const allSets = await dbConnection
    .select()
    .from(workoutSessionExerciseSet)
    .where(
      inArray(
        workoutSessionExerciseSet.workoutSessionExerciseId,
        allWorkoutSessionExercises.map((e) => e.id),
      ),
    );

  return {
    ...workoutSessionData,
    exercises: allWorkoutSessionExercises.map((e) => ({
      ...e,
      sets: allSets.filter((s) => s.workoutSessionExerciseId === e.id),
    })),
  };
}
