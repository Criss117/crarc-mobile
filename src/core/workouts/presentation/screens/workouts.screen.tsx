import { Text } from "@/core/shared/components/text";
import { useFindWorkouts } from "@/core/workouts/application/queries/use-find-workouts";

export function WorkoutsScreen() {
  const { data } = useFindWorkouts();

  return <Text>{JSON.stringify(data, null, 2)}</Text>;
}

export function WorkoutsScreenSkeleton() {
  return null;
}
