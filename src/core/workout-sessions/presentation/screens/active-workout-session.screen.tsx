import { Stack } from "expo-router";

import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { WorkoutSessionExercisesList } from "@/core/workout-sessions/presentation/sections/workout-session-exercises-list";
import { WorkoutSessionHeader } from "@/core/workout-sessions/presentation/sections/workout-session-header";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ActiveWorkoutActions } from "../components/active-workout-actions";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

export function ActiveWorkoutSessionScreen({ workoutSession }: Props) {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ActiveWorkoutActions workoutSession={workoutSession} />
          ),
        }}
      />
      <KeyboardAwareScrollView
        className="px-3"
        contentContainerClassName="gap-y-6"
        bottomOffset={64}
      >
        <WorkoutSessionHeader workoutSession={workoutSession} />
        <WorkoutSessionExercisesList workoutSession={workoutSession} />
      </KeyboardAwareScrollView>
    </>
  );
}

export function ActiveWorkoutSessionScreenSkeleton() {
  return null;
}
