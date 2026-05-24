import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { SkeletonGroup } from "heroui-native/skeleton-group";
import { Text } from "heroui-native/text";
import { Suspense } from "react";
import { View } from "react-native";

import { useFindOneWorkout } from "@/core/workouts/application/hooks/use-find-workouts";

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

function WorkoutDetailSkeleton() {
  return (
    <View
      className="px-4 pt-4 gap-y-4"
      accessibilityRole="none"
      accessibilityLabel="Cargando contenido"
    >
      <SkeletonGroup isSkeletonOnly variant="shimmer" className="gap-y-4">
        {/* Title placeholder */}
        <SkeletonGroup.Item className="h-7 w-2/3 rounded-md" />
        {/* Body content lines */}
        <View className="gap-y-2">
          <SkeletonGroup.Item className="h-4 w-full rounded-md" />
          <SkeletonGroup.Item className="h-4 w-5/6 rounded-md" />
          <SkeletonGroup.Item className="h-4 w-3/4 rounded-md" />
        </View>
      </SkeletonGroup>
    </View>
  );
}

export default function WorkoutDetail() {
  const params = useGlobalSearchParams<{
    workoutid: string;
  }>();

  return (
    <Suspense fallback={<WorkoutDetailSkeleton />}>
      <Suspended workoutId={params.workoutid} />
    </Suspense>
  );
}
