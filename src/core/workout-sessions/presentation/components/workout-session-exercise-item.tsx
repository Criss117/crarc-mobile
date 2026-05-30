import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "heroui-native/button";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { IMAGES } from "@/core/shared/utils/constanst";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { CreateExerciseSet } from "./create-exercise-set";
import { UpdateExerciseSet } from "./update-exercise-set";

type Exercise = WorkoutSessionDetail["exercises"][number];

interface Props {
  exercise: Exercise;
  selectExercise: (exercise: Exercise) => void;
}

export function WorkoutSessionExerciseItem({
  exercise,
  selectExercise,
}: Props) {
  const router = useRouter();
  const { completeExercise } = useActiveWorkoutSession();

  const handleToggleComplete = () => {
    completeExercise.mutate({
      workoutSessionExerciseId: exercise.id,
    });
  };

  return (
    <View className="gap-y-3">
      <View className="flex-row gap-x-2 h-16">
        {exercise.image && (
          <PressableFeedback
            onPress={() => {
              if (!exercise.exerciseId) return;
              router.push({
                pathname: "/exercises/[exerciseid]",
                params: { exerciseid: exercise.exerciseId },
              });
            }}
          >
            <View className="border size-16 border-muted rounded-3xl relative">
              <Image
                style={{
                  width: 62,
                  height: 62,
                  aspectRatio: 1,
                  borderRadius: 12,
                }}
                source={{ uri: exercise.image }}
                placeholder={IMAGES.placeholder}
                contentFit="contain"
                transition={1000}
              />
              <MaterialIcons
                name="question-mark"
                size={18}
                className="absolute bottom-1 right-1 text-muted"
              />
            </View>
          </PressableFeedback>
        )}
        <Text variants={{ size: "h4" }} className="flex-1 line-clamp-2">
          {exercise.name}
        </Text>
        <Button
          size="sm"
          isIconOnly
          variant="ghost"
          onPress={() => selectExercise(exercise)}
        >
          <MaterialIcons name="more-vert" size={18} />
        </Button>
        {exercise.completed ? (
          <Button
            size="sm"
            isIconOnly
            variant="outline"
            isDisabled={completeExercise.isPending}
            onPress={handleToggleComplete}
          >
            <MaterialIcons
              name="check-circle-outline"
              size={18}
              className="text-success"
            />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            isIconOnly
            isDisabled={completeExercise.isPending}
            onPress={handleToggleComplete}
          >
            <MaterialIcons name="check-circle-outline" size={18} />
          </Button>
        )}
      </View>
      <View>
        <View className="flex flex-row gap-x-1">
          <View className="flex-1 items-center justify-center">
            <Text>Set</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text>{exercise.weightDisplayUnit}</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text>Reps</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text>Rir</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="done-all" size={18} />
          </View>
        </View>

        <View>
          {exercise.sets.map((set, index) => (
            <UpdateExerciseSet
              key={set.id}
              completed={exercise.completed}
              weightDisplayUnit={exercise.weightDisplayUnit}
              set={set}
              exerciseId={exercise.id}
              index={index}
              exerciseSetsLength={exercise.sets.length}
            />
          ))}
        </View>

        <CreateExerciseSet
          completed={exercise.completed}
          exerciseId={exercise.id}
          exerciseSetsLength={exercise.sets.length}
        />
      </View>
    </View>
  );
}
