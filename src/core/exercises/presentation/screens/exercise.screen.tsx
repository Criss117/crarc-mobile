import { Image } from "expo-image";
import { RefreshControl, ScrollView, View } from "react-native";

import type {
  ExerciseDetails,
  MuscleSummary,
} from "@/core/exercises/domain/execises.entity";
import { Text } from "@/core/shared/components/text";
import { IMAGES } from "@/core/shared/utils/constanst";
import { Skeleton, SkeletonGroup } from "heroui-native";

interface Props {
  exercise: ExerciseDetails;
  isRefreshing: boolean;
  refresh: () => void;
}

export function ExerciseScreen({ exercise, isRefreshing, refresh }: Props) {
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
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      }
    >
      {exercise.gifUrl && (
        <Image
          source={{ uri: exercise.gifUrl }}
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
          placeholder={IMAGES.placeholder}
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

const instructions = Array.from({ length: 5 }).map((_, i) => i);

export function ExerciseScreenSkeleton() {
  return (
    <ScrollView
      className="flex-1 px-3"
      contentContainerClassName="gap-y-8 pb-8"
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={IMAGES.placeholder}
        style={{
          width: "100%",
          aspectRatio: 1,
        }}
        contentFit="cover"
      />

      <View className="gap-y-2">
        <View>
          <Text>Musculo Primario</Text>
          <Skeleton className="h-4 w-1/2" />
        </View>
        <View>
          <Text>Musculos Secundarios</Text>
          <Skeleton className="h-4 w-2/3" />
        </View>
      </View>

      <View className="gap-y-3 flex-1">
        <Text className="text-xl">Instrucciones</Text>
        <SkeletonGroup className="gap-y-3">
          {instructions.map((i) => (
            <View key={i} className="flex gap-x-2 flex-row ">
              <View className="bg-accent/10 rounded-full p-2 size-10 flex items-center justify-center">
                <Text className="text-sm">{i}</Text>
              </View>
              <View className="flex-col flex-1 gap-y-2">
                <SkeletonGroup.Item className="h-4 w-full" />
                <SkeletonGroup.Item className="h-4 w-4/5" />
              </View>
            </View>
          ))}
        </SkeletonGroup>
      </View>
    </ScrollView>
  );
}
