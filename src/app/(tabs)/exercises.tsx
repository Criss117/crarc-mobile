import { Suspense } from "react";

import { ExercisesFiltersProvider } from "@/core/exercises/presentation/components/exercises-filters/provider";
import {
  ExercisesScreen,
  ExercisesScreenSkeleton,
} from "@/core/exercises/presentation/screens/exercises.screen";

export default function Exercises() {
  return (
    <ExercisesFiltersProvider>
      <Suspense fallback={<ExercisesScreenSkeleton />}>
        <ExercisesScreen />
      </Suspense>
    </ExercisesFiltersProvider>
  );
}
