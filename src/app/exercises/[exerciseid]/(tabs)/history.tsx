import { useGlobalSearchParams } from "expo-router";
import { Suspense } from "react";

import { useFindOneExercise } from "@/core/exercises/application/hooks/use-find-exercises";
import {
  ExerciseHistoryScreen,
  ExerciseHistoryScreenSkeleton,
} from "@/core/exercises/presentation/screens/exercise-history.screen";

function Suspended({ exerciseId }: { exerciseId: string }) {
  const { data, refetch, isRefetching } = useFindOneExercise({
    exerciseId,
  });

  if (!data) return null;

  return (
    <ExerciseHistoryScreen
      exercise={data}
      refresh={refetch}
      isRefreshing={isRefetching}
    />
  );
}

export default function ExerciseHistory() {
  const params = useGlobalSearchParams<{
    exerciseid?: string;
  }>();

  if (!params.exerciseid) return null;

  return (
    <Suspense fallback={<ExerciseHistoryScreenSkeleton />}>
      <Suspended exerciseId={params.exerciseid} />
    </Suspense>
  );
}
