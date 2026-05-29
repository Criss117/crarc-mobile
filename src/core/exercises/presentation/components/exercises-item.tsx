import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Card, cn, PressableFeedback, SkeletonGroup } from "heroui-native";
import { View } from "react-native";

import type { ExerciseSummary } from "@/core/exercises/domain/execises.entity";
import {
  EXERCISES_ITEM_HEIGHT,
  EXERCISES_ITEM_WIDTH,
  IMAGES,
} from "@/core/shared/utils/constanst";

interface Props {
  exercise: ExerciseSummary;
  isSelected?: boolean;
}

interface SelectableProps extends Props {
  isSelected: boolean;
  handleSelectExercise: (exercise: ExerciseSummary) => void;
}

function ExerciseCard({ exercise, isSelected }: Props) {
  return (
    <Card
      style={{
        flex: 1,
        width: EXERCISES_ITEM_WIDTH,
        minHeight: EXERCISES_ITEM_HEIGHT,
        padding: 0,
      }}
      className={cn(
        "border border-transparent gap-y-2",
        isSelected && "border-success",
      )}
    >
      {exercise.image && (
        <View className="items-center justify-center">
          <Image
            source={{ uri: exercise.image }}
            style={{
              width: EXERCISES_ITEM_WIDTH,
              height: EXERCISES_ITEM_WIDTH,
            }}
            placeholder={IMAGES.placeholder}
            contentFit="cover"
            className="aspect-square"
            transition={1000}
          />
        </View>
      )}
      <Card.Header className="flex-1 px-4 pb-4">
        <Card.Title>{exercise.name}</Card.Title>
        <Card.Description className="text-sm line-clamp-1">
          {exercise.muscles.map((m) => m.name).join(", ")}
        </Card.Description>
      </Card.Header>
    </Card>
  );
}

export function ExercisesItem({ exercise }: Props) {
  const router = useRouter();

  return (
    <PressableFeedback
      onPress={() =>
        router.push({
          pathname: "/exercises/[exerciseid]",
          params: { exerciseid: exercise.id },
        })
      }
    >
      <ExerciseCard exercise={exercise} />
    </PressableFeedback>
  );
}

export function SelectableExercisesItem({
  exercise,
  isSelected,
  handleSelectExercise,
}: SelectableProps) {
  return (
    <PressableFeedback onPress={() => handleSelectExercise(exercise)}>
      <ExerciseCard exercise={exercise} isSelected={isSelected} />
    </PressableFeedback>
  );
}
export function ExercisesItemSkeleton() {
  return (
    <Card
      style={{
        flex: 1,
        width: EXERCISES_ITEM_WIDTH,
        minHeight: EXERCISES_ITEM_HEIGHT,
        padding: 0,
      }}
      className="border border-transparent gap-y-2"
    >
      <View className="items-center justify-center">
        <Image
          source={IMAGES.placeholder}
          style={{
            width: EXERCISES_ITEM_WIDTH,
            height: EXERCISES_ITEM_WIDTH,
          }}
          placeholder={IMAGES.placeholder}
          contentFit="cover"
          className="aspect-square"
          transition={1000}
        />
      </View>
      <Card.Header className="flex-1 px-4 pb-4">
        <SkeletonGroup className="gap-y-1">
          <SkeletonGroup.Item className="h-5 w-3/5 rounded-md" />
          <SkeletonGroup.Item className="h-4 w-4/5 rounded-md" />
        </SkeletonGroup>
      </Card.Header>
    </Card>
  );
}
