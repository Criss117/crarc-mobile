import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { eq, sql } from "drizzle-orm";

import { tryCatch } from "@/core/shared/utils/trycatch";
import { dbConnection } from "@/integrations/db";
import {
  exercise,
  exerciseMuscle,
  muscle,
} from "@/integrations/db/schemas/exercises.schema";

export const getExercisesQueryOptions = queryOptions({
  queryKey: ["exercises"],
  queryFn: async () => {
    const exercisesquery = dbConnection
      .select({
        id: exercise.id,
        name: exercise.name,
        searchName: exercise.searchName,
        imageUrl: exercise.imageUrl,
        instructions: exercise.instructions,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        favorite: exercise.favorite,
        isSystem: exercise.isSystem,
        notes: exercise.notes,
        muscles: sql<string>`
          COALESCE(
            JSON_GROUP_ARRAY(
              JSON_OBJECT(
                'id', ${muscle.id},
                'name', ${muscle.name},
                'searchName', ${muscle.searchName},
                'imageUrl', ${muscle.imageUrl}
              )
            ) FILTER (WHERE ${muscle.id} IS NOT NULL),
            '[]'
          )
        `.as("muscles"),
      })
      .from(exercise)
      .leftJoin(exerciseMuscle, eq(exerciseMuscle.exerciseId, exercise.id))
      .leftJoin(muscle, eq(muscle.id, exerciseMuscle.muscleId))
      .groupBy(exercise.id);

    const [data, error] = await tryCatch(exercisesquery.execute());

    if (error) throw error;

    return data.map((d) => ({
      ...d,
      muscles: JSON.parse(d.muscles) as {
        id: string;
        name: string;
        searchName: string;
        imageUrl: string | null;
      }[],
    }));
  },
});

export function useFindExercises() {
  return useSuspenseQuery(getExercisesQueryOptions);
}
