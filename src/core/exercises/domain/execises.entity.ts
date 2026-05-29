import { MuscleExerciseType } from "@/integrations/db/schemas/exercise.types";
import type {
  ExerciseSelect,
  MuscleSelect,
} from "@/integrations/db/schemas/exercises.schema";

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
