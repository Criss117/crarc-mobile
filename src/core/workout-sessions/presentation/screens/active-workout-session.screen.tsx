import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { ScrollView } from "react-native";

import { useMutateWorkoutSessions } from "@/core/workout-sessions/application/hooks/use-mutate-workout-sessions";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { WorkoutSessionExercisesList } from "@/core/workout-sessions/presentation/sections/workout-session-exercises-list";
import { WorkoutSessionHeader } from "@/core/workout-sessions/presentation/sections/workout-session-header";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

export function ActiveWorkoutSessionScreen({ workoutSession }: Props) {
  const router = useRouter();
  const { completeWorkoutSession } = useMutateWorkoutSessions();

  const handleComplete = () => {
    completeWorkoutSession.mutate(undefined, {
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
            <Button onPress={handleComplete}>
              <Button.Label>Completar rutina</Button.Label>
            </Button>
          ),
        }}
      />
      <ScrollView className="px-3" contentContainerClassName="gap-y-4">
        <WorkoutSessionHeader workoutSession={workoutSession} />
        <WorkoutSessionExercisesList workoutSession={workoutSession} />
      </ScrollView>
    </>
  );
}

export function ActiveWorkoutSessionScreenSkeleton() {
  return null;
}
