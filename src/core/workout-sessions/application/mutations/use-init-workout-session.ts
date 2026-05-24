import { useMutation, useQueryClient } from "@tanstack/react-query";

import { findOneWorkout } from "@/core/workouts/application/queries/use-find-one-workout";
import { dbConnection } from "@/integrations/db";
import { workout, workoutSession } from "@/integrations/db/schemas";
import {
  workoutSessionExercise,
  WorkoutSessionExerciseInsert,
} from "@/integrations/db/schemas/workout-session.schema";
import { findWorkoutSessionsQueryOptions } from "../queries/use-find-workout-sessions";

interface InitWorkoutSessionValues {
  workoutId: string;
}

async function initWorkoutSession({ workoutId }: InitWorkoutSessionValues) {
  const workoutData = await findOneWorkout(workoutId);

  if (!workoutData) throw new Error("Workout not found");

  await dbConnection.transaction(async (tx) => {
    const [sessionCreated] = await tx
      .insert(workoutSession)
      .values({
        startedAt: new Date(),
        workoutId: workoutData.id,
      })
      .returning({
        id: workout.id,
      });

    await tx.insert(workoutSessionExercise).values(
      workoutData.exercises.map((e) => ({
        orderIndex: e.orderIndex,
        weightDisplayUnit: "kg",
        workoutSessionId: sessionCreated.id,
        exerciseId: e.exerciseId,
      })) satisfies WorkoutSessionExerciseInsert[],
    );
  });
}

export function useInitWorkoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["init-workout-session"],
    mutationFn: initWorkoutSession,
    onSuccess: () => {
      queryClient.invalidateQueries(findWorkoutSessionsQueryOptions);
    },
  });
}
