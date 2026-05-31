import { FlatList, View } from "react-native";

import type { ExerciseDetails } from "@/core/exercises/domain/execises.entity";
import { Text } from "@/core/shared/components/text";
import { WorkoutSessionExerciseInfo } from "../components/workout-session-exercise-info";

interface Props {
  exercise: ExerciseDetails;
  isRefreshing: boolean;
  refresh: () => void;
}

export function ExerciseHistoryScreen({ exercise }: Props) {
  return (
    <FlatList
      className="px-3 py-4 flex-1"
      data={exercise.workoutSessions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <WorkoutSessionExerciseInfo workoutSessions={item} />
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">No hay historial de ejercicios</Text>
        </View>
      }
      contentContainerClassName="gap-y-4"
    />
  );
}

export function ExerciseHistoryScreenSkeleton() {
  return null;
}
