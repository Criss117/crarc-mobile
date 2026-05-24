import { dbConnection } from "@/integrations/db";
import { workout, workoutExercise } from "@/integrations/db/schemas";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { mapWorkoutsExercisesSummary } from "../mappers";

export async function findOneWorkoutQuery(workoutId: string) {
  const allWorkouts = await dbConnection
    .select({
      ...getTableColumns(workout),
      exercises: sql<string>`
          JSON_GROUP_ARRAY(
            JSON_OBJECT(
              'workoutId', ${workoutExercise.workoutId},
              'exerciseId', ${workoutExercise.exerciseId},
              'orderIndex', ${workoutExercise.orderIndex},
              'notes', ${workoutExercise.notes}
            )
          )
        `,
    })
    .from(workout)
    .innerJoin(workoutExercise, eq(workoutExercise.workoutId, workout.id))
    .groupBy(workout.id)
    .where(eq(workout.id, workoutId))
    .limit(1)
    .execute();

  const data = allWorkouts.at(0);

  if (!data) return null;

  return {
    ...data,
    exercises: mapWorkoutsExercisesSummary(data.exercises),
  };
}
