import type { ExerciseSummary } from "@/core/exercises/domain/execises.entity";
import type { WorkoutSelect } from "@/integrations/db/schemas/workout.schema";

export type WorkoutSummary = Omit<WorkoutSelect, "createdAt" | "updatedAt"> & {
  totalExercises: number;
};

export type WorkoutDetail = WorkoutSelect & {
  exercises: (ExerciseSummary & {
    orderIndex: number;
  })[];
};
