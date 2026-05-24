import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";

import { dbConnection } from "@/integrations/db";
import {
  workoutSession,
  workoutSessionExercise,
} from "@/integrations/db/schemas";
import { WorkoutSessionExerciseSelect } from "@/integrations/db/schemas/workout-session.schema";

async function findWorkoutSessions() {
  const allWorkoutSessions = await dbConnection
    .select({
      ...getTableColumns(workoutSession),
      exercises: sql<string>`
        COALESCE(
          JSON_GROUP_ARRAY(
            JSON_OBJECT(
              'id', ${workoutSessionExercise.id},
              'workoutSessionId', ${workoutSessionExercise.workoutSessionId},
              'exerciseId', ${workoutSessionExercise.exerciseId},
              'orderIndex', ${workoutSessionExercise.orderIndex},
              'notes', ${workoutSessionExercise.notes},
              'weightDisplayUnit', ${workoutSessionExercise.weightDisplayUnit},
              'createdAt', ${workoutSessionExercise.createdAt},
              'updatedAt', ${workoutSessionExercise.updatedAt},
              'deletedAt', ${workoutSessionExercise.deletedAt}
            )
          ) FILTER (WHERE ${workoutSessionExercise.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(workoutSession)
    .leftJoin(
      workoutSessionExercise,
      eq(workoutSessionExercise.workoutSessionId, workoutSession.id),
    )
    .orderBy(desc(workoutSession.createdAt))
    .execute();

  return allWorkoutSessions.map((w) => ({
    ...w,
    exercises: JSON.parse(w.exercises) as WorkoutSessionExerciseSelect[],
  }));
}

export const findWorkoutSessionsQueryOptions = queryOptions({
  queryKey: ["workout-sessions"],
  queryFn: findWorkoutSessions,
});

export function useFindAllWorkoutSessions() {
  return useSuspenseQuery(findWorkoutSessionsQueryOptions);
}
