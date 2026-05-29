import { and, eq, like, or, type SQL, sql } from "drizzle-orm";

import type {
  ExerciseSummary,
  MuscleSummary,
} from "@/core/exercises/domain/execises.entity";
import { DEFAULT_LIMIT } from "@/core/shared/utils/constanst";
import { dbConnection } from "@/integrations/db";
import { exercise, exerciseMuscle, muscle } from "@/integrations/db/schemas";

type Options = {
  cursor: {
    limit: number;
    page: number; // page starts at 0
  };
  filters: {
    muscleId?: string;
    searchQuery?: string;
  };
};

export async function findManyExercisesQuery(options: Options) {
  const filters: (SQL<unknown> | undefined)[] = [];
  const offset = !options.cursor.page
    ? 0
    : options.cursor.page * options.cursor.limit;
  const limit = options.cursor.limit || DEFAULT_LIMIT;

  if (options.filters.muscleId)
    filters.push(
      sql`${exercise.id} IN (
      SELECT ${exerciseMuscle.exerciseId} 
      FROM ${exerciseMuscle} 
      WHERE ${exerciseMuscle.muscleId} = ${options.filters.muscleId}
    )`,
    );

  if (options.filters.searchQuery)
    filters.push(
      or(
        like(exercise.searchName, `%${options.filters.searchQuery}%`),
        like(exercise.name, `%${options.filters.searchQuery}%`),
      ),
    );

  const exercisesquery = await dbConnection
    .select({
      id: exercise.id,
      name: exercise.name,
      searchName: exercise.searchName,
      image: exercise.image,
      gifUrl: exercise.gifUrl,
      category: exercise.category,
      target: exercise.target,
      instructionsStep: exercise.instructionsStep,
      instructions: exercise.instructions,
      equipment: exercise.equipment,
      favorite: exercise.favorite,
      notes: exercise.notes,
      muscles: sql<string>`
        COALESCE(
          JSON_GROUP_ARRAY(
            JSON_OBJECT(
              'id', ${muscle.id},
              'name', ${muscle.name},
              'searchName', ${muscle.searchName},
              'imageUrl', ${muscle.imageUrl},
              'type', ${exerciseMuscle.type}
            )
          ) FILTER (WHERE ${muscle.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(exercise)
    .leftJoin(exerciseMuscle, eq(exerciseMuscle.exerciseId, exercise.id))
    .leftJoin(muscle, eq(muscle.id, exerciseMuscle.muscleId))
    .limit(limit + 1)
    .where(and(...filters))
    .offset(offset)
    .groupBy(exercise.id);

  const data = exercisesquery.map((d) => ({
    ...d,
    muscles: JSON.parse(d.muscles) as MuscleSummary[],
  })) satisfies ExerciseSummary[];

  const nextPage = data.length > limit ? options.cursor.page + 1 : null;

  return {
    data: data.slice(0, limit),
    nextPage,
  };
}
