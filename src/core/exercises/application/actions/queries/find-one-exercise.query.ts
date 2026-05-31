import { asc, eq, inArray } from "drizzle-orm";

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
      workoutExerciseId: workoutSessionExercise.id,
      weightDisplayUnit: workoutSessionExercise.weightDisplayUnit,
    })
    .from(workoutSessionExercise)
    .innerJoin(
      workoutSession,
      eq(workoutSession.id, workoutSessionExercise.workoutSessionId),
    )
    .where(eq(workoutSessionExercise.exerciseId, data.id));

  const [allMuscles, allWorkoutSessions] = await Promise.all([
    musclesQuery,
    workoutSessionsQuery,
  ]);

  const allSets = await dbConnection
    .select({
      id: workoutSessionExerciseSet.id,
      notes: workoutSessionExerciseSet.notes,
      workoutSessionExerciseId:
        workoutSessionExerciseSet.workoutSessionExerciseId,
      reps: workoutSessionExerciseSet.reps,
      rir: workoutSessionExerciseSet.rir,
      weightInGrams: workoutSessionExerciseSet.weightInGrams,
    })
    .from(workoutSessionExerciseSet)
    .where(
      inArray(
        workoutSessionExerciseSet.workoutSessionExerciseId,
        allWorkoutSessions.map((e) => e.workoutExerciseId),
      ),
    )
    .orderBy(asc(workoutSessionExerciseSet.createdAt));

  return {
    ...data,
    muscles: allMuscles,
    workoutSessions: allWorkoutSessions.map((ws) => ({
      ...ws,
      sets: allSets.filter(
        (s) => s.workoutSessionExerciseId === ws.workoutExerciseId,
      ),
    })),
  };
}
