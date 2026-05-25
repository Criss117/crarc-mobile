import { Text } from "heroui-native/text";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { SECONDS } from "@/core/shared/utils/constanst";
import { timeAgo } from "@/core/shared/utils/timeago";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { useEffect, useState } from "react";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

export function WorkoutSessionHeader({ workoutSession }: Props) {
  const [timeActive, setTimeActive] = useState(
    workoutSession.startedAt ? timeAgo(workoutSession.startedAt) : "0",
  );

  const completedWorkoutExercises =
    workoutSession.exercises.filter((e) => e.completed).length || 0;

  useEffect(() => {
    if (!workoutSession.startedAt) return;

    const interval = setInterval(() => {
      setTimeActive(timeAgo(workoutSession.startedAt));
    }, SECONDS);

    return () => clearInterval(interval);
  }, [workoutSession.startedAt]);

  return (
    <View className="border-y border-muted flex-row justify-around items-center">
      <View className="flex-row items-center flex-1 justify-center">
        <Text>{timeActive}</Text>
      </View>
      <MaterialIcons name="circle" size={5} />
      <View className="flex-row items-center flex-1 justify-center">
        <Text className="text-muted">
          {completedWorkoutExercises} / {workoutSession.exercises.length}{" "}
          ejercicios
        </Text>
      </View>
    </View>
  );
}
