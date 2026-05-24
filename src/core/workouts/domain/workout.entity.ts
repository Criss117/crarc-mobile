import type {
  WorkoutExerciseSelect,
  WorkoutSelect,
} from "@/integrations/db/schemas/workout.schema";

export type WorkoutSummary = WorkoutSelect & {
  exercises: Omit<
    WorkoutExerciseSelect,
    "createdAt" | "updatedAt" | "deletedAt"
  >[];
};
