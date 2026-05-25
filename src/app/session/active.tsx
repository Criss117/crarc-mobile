import { useRouter } from "expo-router";
import { Suspense } from "react";

import { useFindActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-find-workout-sessions";
import {
  ActiveWorkoutSessionScreen,
  ActiveWorkoutSessionScreenSkeleton,
} from "@/core/workout-sessions/presentation/screens/active-workout-session.screen";

function SuspenseWorkoutSession() {
  const router = useRouter();
  const { data } = useFindActiveWorkoutSession();

  if (!data) {
    router.replace({
      pathname: "/workouts",
    });

    return null;
  }

  return <ActiveWorkoutSessionScreen workoutSession={data} />;
}

export default function ActiveWorkoutSession() {
  return (
    <Suspense fallback={<ActiveWorkoutSessionScreenSkeleton />}>
      <SuspenseWorkoutSession />
    </Suspense>
  );
}
