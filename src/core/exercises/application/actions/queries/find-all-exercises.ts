import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import type {
  ExerciseSummary,
  MuscleSummary,
} from "@/core/exercises/domain/execises.entity";
import { dbConnection } from "@/integrations/db";
import { exercise, exerciseMuscle, muscle } from "@/integrations/db/schemas";

const musclesSummarySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    searchName: z.string(),
    imageUrl: z.string().nullable(),
  }),
);

function mapMusclesSummary(muscles: string): MuscleSummary[] {
  const jsonData = JSON.parse(muscles);

  return musclesSummarySchema.parse(jsonData);
}

export async function findAllExercises(): Promise<ExerciseSummary[]> {
  const exercisesquery = await dbConnection
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

  return exercisesquery.map((d) => ({
    ...d,
    muscles: mapMusclesSummary(d.muscles),
  }));
}
