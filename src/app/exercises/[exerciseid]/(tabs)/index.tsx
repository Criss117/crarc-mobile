import { useGlobalSearchParams } from "expo-router";
import { Suspense } from "react";

import { useFindOneExercise } from "@/core/exercises/application/hooks/use-find-exercises";
import {
  ExerciseScreen,
  ExerciseScreenSkeleton,
} from "@/core/exercises/presentation/screens/exercise.screen";

function Suspended({ exerciseId }: { exerciseId: string }) {
  const { data, refetch, isRefetching } = useFindOneExercise({
    exerciseId,
  });

  if (!data) return null;

  return (
    <ExerciseScreen
      exercise={data}
      refresh={refetch}
      isRefreshing={isRefetching}
    />
  );
}

export default function ExercisesTabs() {
  const params = useGlobalSearchParams<{
    exerciseid?: string;
  }>();

  if (!params.exerciseid) return null;

  return (
    <Suspense fallback={<ExerciseScreenSkeleton />}>
      <Suspended exerciseId={params.exerciseid} />
    </Suspense>
  );
}
