import { eq, sql } from "drizzle-orm";

import type { ExerciseDetails } from "@/core/exercises/domain/execises.entity";
import { dbConnection } from "@/integrations/db";
import {
  exercise,
  exerciseMuscle,
  muscle,
  workoutSession,
  workoutSessionExercise,
  workoutSessionExerciseSet,
} from "@/integrations/db/schemas";

interface FindOneExerciseQuery {
  exerciseId: string;
}

export async function findOneExerciseQuery(
  query: FindOneExerciseQuery,
): Promise<ExerciseDetails | null> {
  const allExercises = await dbConnection
    .select()
    .from(exercise)
    .where(eq(exercise.id, query.exerciseId));

  const data = allExercises.at(0);

  if (!data) return null;

  const musclesQuery = dbConnection
    .select({
      id: muscle.id,
      name: muscle.name,
      searchName: muscle.searchName,
      imageUrl: muscle.imageUrl,
      type: exerciseMuscle.type,
    })
    .from(exerciseMuscle)
    .innerJoin(muscle, eq(muscle.id, exerciseMuscle.muscleId))
    .where(eq(exerciseMuscle.exerciseId, data.id));

  const workoutSessionsQuery = dbConnection
    .select({
      id: workoutSession.id,
      name: workoutSession.name,
      createdAt: workoutSession.createdAt,
      sets: sql<string>`
        COALESCE(
          JSON_GROUP_ARRAY(
            JSON_OBJECT(
              'id', ${workoutSessionExerciseSet.id},
              'notes', ${workoutSessionExerciseSet.notes},
              'reps', ${workoutSessionExerciseSet.reps},
              'rir', ${workoutSessionExerciseSet.rir},
              'weightInGrams', ${workoutSessionExerciseSet.weightInGrams}
            )
          ) FILTER (WHERE ${workoutSessionExerciseSet.workoutSessionExerciseId} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(workoutSessionExercise)
    .innerJoin(
      workoutSession,
      eq(workoutSession.id, workoutSessionExercise.workoutSessionId),
    )
    .leftJoin(
      workoutSessionExerciseSet,
      eq(
        workoutSessionExerciseSet.workoutSessionExerciseId,
        workoutSessionExercise.id,
      ),
    )
    .where(eq(workoutSessionExercise.exerciseId, data.id));

  const [allMuscles, allWorkoutSessions] = await Promise.all([
    musclesQuery,
    workoutSessionsQuery,
  ]);

  return {
    ...data,
    muscles: allMuscles,
    workoutSessions: allWorkoutSessions.map((ws) => ({
      ...ws,
      sets: JSON.parse(
        ws.sets,
      ) as ExerciseDetails["workoutSessions"][number]["sets"],
    })),
  };
}
