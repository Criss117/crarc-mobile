import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";

import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { WorkoutSessionExercisesList } from "@/core/workout-sessions/presentation/sections/workout-session-exercises-list";
import { WorkoutSessionHeader } from "@/core/workout-sessions/presentation/sections/workout-session-header";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

export function ActiveWorkoutSessionScreen({ workoutSession }: Props) {
  const router = useRouter();
  const { completeWorkout } = useActiveWorkoutSession();

  const handleComplete = () => {
    completeWorkout.mutate(undefined, {
      onSuccess: () => {
        router.replace({
          pathname: "/workouts",
        });
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button onPress={handleComplete} variant="outline" size="sm">
              <Button.Label>Completar</Button.Label>
            </Button>
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
