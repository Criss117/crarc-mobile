import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { tryCatch } from "@/core/shared/utils/trycatch";
import { dbConnection } from "@/integrations/db";
import { muscle } from "@/integrations/db/schemas";

export const findAllMusclesQueryOptions = queryOptions({
  queryKey: ["muscles"],
  queryFn: async () => {
    const musclesQuery = dbConnection
      .select({
        id: muscle.id,
        name: muscle.name,
        searchName: muscle.searchName,
        imageUrl: muscle.imageUrl,
      })
      .from(muscle)
      .orderBy(muscle.name);

    const [data, error] = await tryCatch(musclesQuery.execute());

    if (error) throw error;

    return data;
  },
});

export function useFindMuscles() {
  return useSuspenseQuery(findAllMusclesQueryOptions);
}

export type Muscle = Awaited<ReturnType<typeof useFindMuscles>>["data"][number];
