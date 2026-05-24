import { findOneWorkoutQuery } from "@/core/workouts/application/actions/queries/find-one-workout.query";
import { dbConnection } from "@/integrations/db";
import {
  workoutSession,
  workoutSessionExercise,
} from "@/integrations/db/schemas";
import type { WorkoutSessionExerciseInsert } from "@/integrations/db/schemas/workout-session.schema";

type InitWorkoutSessionCommand = {
  workoutId: string;
};

export async function initWorkoutSessionCommand(
  cmd: InitWorkoutSessionCommand,
) {
  const workoutData = await findOneWorkoutQuery(cmd.workoutId);

  if (!workoutData) throw new Error("Workout not found");

  await dbConnection.transaction(async (tx) => {
    const [sessionCreated] = await tx
      .insert(workoutSession)
      .values({
        startedAt: new Date(),
        workoutId: workoutData.id,
      })
      .returning({
        id: workoutSession.id,
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
