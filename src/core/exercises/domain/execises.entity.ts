import { MuscleExerciseType } from "@/integrations/db/schemas/exercise.types";
import type {
  ExerciseSelect,
  MuscleSelect,
} from "@/integrations/db/schemas/exercises.schema";
import { WorkoutSessionExerciseSetSelect } from "@/integrations/db/schemas/workout-session.schema";

export type MuscleSummary = Omit<
  MuscleSelect,
  "createdAt" | "updatedAt" | "deletedAt"
> & {
  type: MuscleExerciseType;
};

export type ExerciseSummary = Omit<
  ExerciseSelect,
  "createdAt" | "updatedAt" | "deletedAt"
> & {
  muscles: MuscleSummary[];
};

export type ExerciseDetails = ExerciseSelect & {
  muscles: MuscleSummary[];
  workoutSessions: {
    id: string;
    name: string;
    createdAt: Date;
    weightDisplayUnit: "lb" | "kg";
    sets: Omit<
      WorkoutSessionExerciseSetSelect,
      "createdAt" | "updatedAt" | "deletedAt" | "workoutSessionExerciseId"
    >[];
  }[];
};
