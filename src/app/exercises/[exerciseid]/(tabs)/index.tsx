import { Image } from "expo-image";
import { useGlobalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { useFindOneExercise } from "@/core/exercises/application/hooks/use-find-exercises";

export default function ExercisesTabs() {
  const params = useGlobalSearchParams<{
    exerciseid: string;
  }>();
  const { data } = useFindOneExercise({
    exerciseId: params.exerciseid,
  });

  const exercise = data!;

  return (
    <ScrollView className="px-3 flex-1">
      {exercise.gifUrl && (
        <View className="items-center justify-center bg-red-500">
          <Image
            source={{ uri: exercise.gifUrl }}
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: 1,
            }}
            contentFit="cover"
          />
        </View>
      )}
    </ScrollView>
  );
}
