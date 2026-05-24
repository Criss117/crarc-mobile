import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { Text } from "heroui-native/text";
import { Suspense } from "react";

import { useFindOneWorkout } from "@/core/workouts/application/queries/use-find-one-workout";

interface Props {
  workoutId: string;
}

function Suspended({ workoutId }: Props) {
  const router = useRouter();
  const { data } = useFindOneWorkout(workoutId);

  if (!data) {
    router.replace({
      pathname: "/workouts",
    });
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.name,
        }}
      />
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </>
  );
}

export default function WorkoutDetail() {
  const params = useGlobalSearchParams<{
    workoutid: string;
  }>();

  return (
    <Suspense fallback={null}>
      <Suspended workoutId={params.workoutid} />
    </Suspense>
  );
}
