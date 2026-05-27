import { create } from "zustand";

import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import type { WorkoutDetail } from "@/core/workouts/domain/workout.entity";

interface WorkoutSessionData {
  workoutTemplate: WorkoutDetail | null;
  activeSession: WorkoutSessionDetail | null;
}

interface WorkoutSessionStoreActions {
  init(template: WorkoutDetail, activeSession: WorkoutSessionDetail): void;
}

type WorkoutSessionStore = WorkoutSessionData & WorkoutSessionStoreActions;

export const useActiveWorkoutSessionStore = create<WorkoutSessionStore>()(
  (set) => ({
    workoutTemplate: null,
    activeSession: null,

    init(activeSession) {},
  }),
);
