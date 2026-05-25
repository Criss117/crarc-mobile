import { View } from "react-native";

import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { WorkoutSessionExerciseItem } from "../components/workout-session-exercise-item";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

export function WorkoutSessionExercisesList({ workoutSession }: Props) {
  return (
    <View className="gap-y-10">
      {workoutSession.exercises.map((e) => (
        <WorkoutSessionExerciseItem key={e.id} exercise={e} />
      ))}
    </View>
  );
}
