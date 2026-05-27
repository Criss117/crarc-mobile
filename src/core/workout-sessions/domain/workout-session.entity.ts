import type {
  WorkoutSessionExerciseSelect,
  WorkoutSessionExerciseSetSelect,
  WorkoutSessionSelect,
} from "@/integrations/db/schemas/workout-session.schema";

export type WorkoutSessionSummary = WorkoutSessionSelect & {
  totalExercises: number;
};

export type WorkoutSessionDetail = WorkoutSessionSelect & {
  exercises: Array<
    Omit<
      WorkoutSessionExerciseSelect,
      "createdAt" | "updatedAt" | "deletedAt"
    > & {
      name: string | null;
      sets: Omit<
        WorkoutSessionExerciseSetSelect,
        "createdAt" | "updatedAt" | "deletedAt"
      >[];
    }
  >;
};
