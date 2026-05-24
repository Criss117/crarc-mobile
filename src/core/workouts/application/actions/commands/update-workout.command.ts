import { eq } from "drizzle-orm";

import { ensureExercisesExists } from "@/core/exercises/application/services/ensure-exercises-exists.service";
import { normalizeString } from "@/core/shared/utils/normalize";
import { findOneWorkoutQuery } from "@/core/workouts/application/actions/queries/find-one-workout.query";
import { checkWorkoutName } from "@/core/workouts/application/services/check-workout-name.service";
import { dbConnection } from "@/integrations/db";
import {
  workout,
  workoutExercise,
  WorkoutExerciseInsert,
  WorkoutInsert,
} from "@/integrations/db/schemas/workout.schema";

type UpdateWorkoutCommand = Omit<WorkoutInsert, "searchName" | "id"> & {
  id: string;
  exercises: Omit<WorkoutExerciseInsert, "workoutId">[];
};

export async function updateWorkoutCommand(cmd: UpdateWorkoutCommand) {
  const exercisesIds = cmd.exercises.map((e) => e.exerciseId);

  const [, errorExercises] = await ensureExercisesExists(exercisesIds);

  if (errorExercises) throw errorExercises;

  const workoutData = await findOneWorkoutQuery(cmd.id);

  if (!workoutData) throw new Error("El workout no existe");

  if (workoutData.name !== cmd.name) {
    const [, errorWorkoutName] = await checkWorkoutName(cmd.name, cmd.id);

    if (errorWorkoutName) throw errorWorkoutName;
  }

  await dbConnection.transaction(async (tx) => {
    const [workoutUpdated] = await tx
      .update(workout)
      .set({
        name: cmd.name,
        description: cmd.description,
        searchName: normalizeString(cmd.name),
      })
      .returning({
        id: workout.id,
      });

    await tx
      .delete(workoutExercise)
      .where(eq(workoutExercise.workoutId, workoutUpdated.id));

    await tx.insert(workoutExercise).values(
      cmd.exercises.map((e) => ({
        ...e,
        workoutId: workoutUpdated.id,
      })),
    );
  });
}
