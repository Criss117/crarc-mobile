import { and, eq, not, or } from "drizzle-orm";

import { normalizeString } from "@/core/shared/utils/normalize";
import { err, ok } from "@/core/shared/utils/trycatch";
import { dbConnection } from "@/integrations/db";
import { workout } from "@/integrations/db/schemas";

export async function checkWorkoutName(name: string, omitWorkoutId?: string) {
  const baseFilters = or(
    eq(workout.name, name),
    eq(workout.searchName, normalizeString(name)),
  );

  const filters = omitWorkoutId
    ? and(baseFilters, not(eq(workout.id, omitWorkoutId)))
    : or(eq(workout.name, name), eq(workout.searchName, normalizeString(name)));

  const nameExists = await dbConnection
    .select({
      name: workout.name,
    })
    .from(workout)
    .where(filters)
    .limit(1);

  if (nameExists.length) err(new Error("El nombre ya existe"));

  return ok(null);
}
