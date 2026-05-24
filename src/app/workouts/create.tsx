import { Suspense } from "react";

import {
  CreateWorkoutScreen,
  CreateWorkoutScreenSkeleton,
} from "@/core/workouts/presentation/screens/create-workout.screen";

export default function CreateWorkout() {
  return (
    <Suspense fallback={<CreateWorkoutScreenSkeleton />}>
      <CreateWorkoutScreen />
    </Suspense>
  );
}
