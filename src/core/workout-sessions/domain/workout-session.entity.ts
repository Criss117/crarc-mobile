import type {
  WorkoutSessionExerciseSelect,
  WorkoutSessionExerciseSetSelect,
  WorkoutSessionSelect,
} from "@/integrations/db/schemas/workout-session.schema";

export type WorkoutSessionDetail = WorkoutSessionSelect & {
  exercises: (WorkoutSessionExerciseSelect & {
    name: string | null;
    sets: WorkoutSessionExerciseSetSelect[];
  })[];
};
