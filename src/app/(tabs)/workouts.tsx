import { Suspense } from "react";

import {
  WorkoutsScreen,
  WorkoutsScreenSkeleton,
} from "@/core/workouts/presentation/screens/workouts.screen";

export default function Workouts() {
  return (
    <Suspense fallback={<WorkoutsScreenSkeleton />}>
      <WorkoutsScreen />
    </Suspense>
  );
}
