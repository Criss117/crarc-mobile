import { ensureExercisesExists } from "@/core/exercises/application/services/ensure-exercises-exists.service";
import { normalizeString } from "@/core/shared/utils/normalize";
import { checkWorkoutName } from "@/core/workouts/application/services/check-workout-name.service";
import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";

type CreateWorkoutCommand = {
  name: string;
  description?: string | null | undefined;
  exercises: {
    exerciseId: string;
    orderIndex: number;
  }[];
};

export async function createWorkoutCommand(cmd: CreateWorkoutCommand) {
  const exercisesIds = cmd.exercises.map((e) => e.exerciseId);

  const [, errorExercises] = await ensureExercisesExists(exercisesIds);

  if (errorExercises) throw errorExercises;

  const [, errorWorkoutName] = await checkWorkoutName(cmd.name);

  if (errorWorkoutName) throw errorWorkoutName;

  await dbConnection.transaction(async (tx) => {
    const [workoutCreated] = await tx
      .insert(workout)
      .values({
        name: cmd.name,
        description: cmd.description,
        searchName: normalizeString(cmd.name),
      })
      .returning({
        id: workout.id,
      });

    await tx.insert(workoutExercise).values(
      cmd.exercises.map((e) => ({
        ...e,
        workoutId: workoutCreated.id,
      })),
    );
  });
}
