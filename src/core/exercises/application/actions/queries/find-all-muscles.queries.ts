import { MuscleSummary } from "@/core/exercises/domain/execises.entity";
import { dbConnection } from "@/integrations/db";
import { muscle } from "@/integrations/db/schemas";

export async function findAllMuscles(): Promise<MuscleSummary[]> {
  return dbConnection
    .select({
      id: muscle.id,
      name: muscle.name,
      searchName: muscle.searchName,
      imageUrl: muscle.imageUrl,
    })
    .from(muscle)
    .orderBy(muscle.name)
    .execute();
}
