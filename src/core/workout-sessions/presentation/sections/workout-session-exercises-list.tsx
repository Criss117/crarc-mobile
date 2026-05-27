import { useState } from "react";
import { View } from "react-native";

import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { WorkoutSessionExerciseItem } from "@/core/workout-sessions/presentation/components/workout-session-exercise-item";
import { WorkoutSessionExercisesActions } from "@/core/workout-sessions/presentation/components/workout-session-exercises-actions";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

type Exercise = WorkoutSessionDetail["exercises"][number];

export function WorkoutSessionExercisesList({ workoutSession }: Props) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const selectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const unselectExercise = () => {
    setSelectedExercise(null);
  };

  return (
    <View className="gap-y-10">
      {workoutSession.exercises.map((e) => (
        <WorkoutSessionExerciseItem
          key={e.id}
          exercise={e}
          selectExercise={selectExercise}
        />
      ))}
      <WorkoutSessionExercisesActions
        exercise={selectedExercise}
        unselectExercise={unselectExercise}
      />
    </View>
  );
}
