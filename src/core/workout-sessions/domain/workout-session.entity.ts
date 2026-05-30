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
      exerciseId: string | null;
      name: string | null;
      image: string | null;
      sets: Omit<
        WorkoutSessionExerciseSetSelect,
        "createdAt" | "updatedAt" | "deletedAt"
      >[];
    }
  >;
};
