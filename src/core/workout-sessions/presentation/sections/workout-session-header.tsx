import { useEffect, useState } from "react";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { SECONDS } from "@/core/shared/utils/constanst";
import { formatDuration, timeAgo } from "@/core/shared/utils/timeago";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

export function WorkoutSessionHeader({ workoutSession }: Props) {
  const [timeActive, setTimeActive] = useState(
    workoutSession.startedAt ? timeAgo(workoutSession.startedAt) : "00:00:00",
  );

  const completedWorkoutExercises =
    workoutSession.exercises.filter((e) => e.completed).length || 0;

  const totalSets = workoutSession.exercises.reduce(
    (acc, e) => acc + e.sets.length,
    0,
  );

  useEffect(() => {
    if (!workoutSession.startedAt) return;

    const interval = setInterval(() => {
      setTimeActive(formatDuration(workoutSession.startedAt));
    }, SECONDS);

    return () => clearInterval(interval);
  }, [workoutSession.startedAt]);

  return (
    <View className="border-y border-muted flex-row justify-around items-center py-4">
      <View className="items-center flex-1 justify-center">
        <Text className="text-muted text-sm">Duración</Text>
        <Text>{timeActive}</Text>
      </View>
      <MaterialIcons name="circle" size={5} />
      <View className="items-center flex-1 justify-center">
        <Text className="text-muted text-sm">Ejercicios</Text>
        <Text className="text-muted">
          {completedWorkoutExercises} / {workoutSession.exercises.length}
        </Text>
      </View>
      <MaterialIcons name="circle" size={5} />
      <View className="items-center flex-1 justify-center">
        <Text className="text-muted text-sm">Sets</Text>
        <Text className="text-muted">{totalSets}</Text>
      </View>
    </View>
  );
}
