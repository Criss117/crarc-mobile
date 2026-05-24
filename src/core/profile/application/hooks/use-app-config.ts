import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { profileActions } from "@/core/profile/application/actions";

export const findAppConfigQueryOptions = queryOptions({
  queryKey: ["appConfig"],
  queryFn: profileActions.querires.findAppConfig,
});

export function useAppConfig() {
  const appConfig = useSuspenseQuery(findAppConfigQueryOptions);

  return { appConfig };
}
