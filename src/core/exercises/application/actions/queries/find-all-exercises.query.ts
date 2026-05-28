import { eq, sql } from "drizzle-orm";

import type {
  ExerciseSummary,
  MuscleSummary,
} from "@/core/exercises/domain/execises.entity";
import { dbConnection } from "@/integrations/db";
import { exercise, exerciseMuscle, muscle } from "@/integrations/db/schemas";

export async function findAllExercisesQuery(): Promise<ExerciseSummary[]> {
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
      primaryMuscle: sql<string>`
            MAX(
              CASE WHEN ${exerciseMuscle.type} = 'primary' THEN
                JSON_OBJECT(
                  'id', ${muscle.id},
                  'name', ${muscle.name},
                  'searchName', ${muscle.searchName},
                  'imageUrl', ${muscle.imageUrl},
                  'type', ${exerciseMuscle.type}
                ) END
            )
      `.as("primary_muscle"),
      secondaryMuscles: sql<string>`
            JSON_GROUP_ARRAY(
              CASE WHEN ${exerciseMuscle.type} = 'secondary' THEN
                JSON_OBJECT(
                  'id', ${muscle.id},
                  'name', ${muscle.name},
                  'searchName', ${muscle.searchName},
                  'imageUrl', ${muscle.imageUrl},
                  'type', ${exerciseMuscle.type}
                ) END
            ) FILTER (WHERE ${muscle.id} IS NOT NULL)         
          `.as("secondary_muscles"),
    })
    .from(exercise)
    .leftJoin(exerciseMuscle, eq(exerciseMuscle.exerciseId, exercise.id))
    .leftJoin(muscle, eq(muscle.id, exerciseMuscle.muscleId))
    .limit(20)
    .groupBy(exercise.id);

  return exercisesquery.map((d) => ({
    ...d,
    primaryMuscle: JSON.parse(d.primaryMuscle) as MuscleSummary,
    secondaryMuscles: (
      JSON.parse(d.secondaryMuscles) as MuscleSummary[]
    ).filter(Boolean),
  }));
}
