import { useGlobalSearchParams, useRouter } from "expo-router";
import { Suspense } from "react";

import { useFindOneWorkout } from "@/core/workouts/application/hooks/use-find-workouts";
import {
  UpdateWorkoutScreen,
  UpdateWorkoutScreenSkeleton,
} from "@/core/workouts/presentation/screens/update-workout.screen";

function SuspendedWorkout({ workoutId }: { workoutId: string }) {
  const router = useRouter();

  const { data } = useFindOneWorkout(workoutId);

  if (!data) {
    router.replace({
      pathname: "/workouts",
    });

    return null;
  }

  return <UpdateWorkoutScreen workout={data} />;
}

export default function UpdateWorkout() {
  const params = useGlobalSearchParams<{
    workoutid: string;
  }>();

  return (
    <Suspense fallback={<UpdateWorkoutScreenSkeleton />}>
      <SuspendedWorkout workoutId={params.workoutid} />
    </Suspense>
  );
}
