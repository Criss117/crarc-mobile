import { Image } from "expo-image";
import { ScrollView, View } from "react-native";

import type {
  ExerciseDetails,
  MuscleSummary,
} from "@/core/exercises/domain/execises.entity";
import { Text } from "@/core/shared/components/text";

interface Props {
  exercise: ExerciseDetails;
}

export function ExerciseScreen({ exercise }: Props) {
  const muscles = exercise.muscles.reduce(
    (prev, acc) => {
      if (acc.type === "primary") {
        return {
          ...prev,
          primary: acc,
        };
      }

      return {
        ...prev,
        secondary: [...(prev.secondary || []), acc],
      };
    },
    {} as {
      primary: MuscleSummary;
      secondary: MuscleSummary[];
    },
  );

  return (
    <ScrollView
      className="flex-1 px-3"
      contentContainerClassName="gap-y-8 pb-8"
      showsVerticalScrollIndicator={false}
    >
      {exercise.gifUrl && (
        <Image
          source={{ uri: exercise.gifUrl }}
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
          contentFit="cover"
        />
      )}

      <View className="gap-y-2">
        <View>
          <Text>Musculo Primario</Text>
          <Text className="text-muted">{muscles.primary.name}</Text>
        </View>
        <View>
          <Text>Musculos Secundarios</Text>
          <Text className="text-muted">
            {muscles.secondary.map((m) => m.name).join(", ")}
          </Text>
        </View>
      </View>

      <View className="gap-y-3 flex-1">
        <Text className="text-xl">Instrucciones</Text>
        {exercise.instructionsStep.map((i, index) => (
          <View key={index} className="flex gap-x-2 flex-row ">
            <View className="bg-accent/10 rounded-full p-2 size-10 flex items-center justify-center">
              <Text className="text-sm">{index + 1}</Text>
            </View>
            <Text className="flex-1 text-muted">{i}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function ExerciseScreenSkeleton() {
  return null;
}
