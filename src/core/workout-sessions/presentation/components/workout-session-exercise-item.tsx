import { Button } from "heroui-native/button";
import { Text } from "heroui-native/text";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { CreateExerciseSet } from "./create-exercise-set";
import { UpdateExerciseSet } from "./update-exercise-set";

interface Props {
  exercise: WorkoutSessionDetail["exercises"][number];
}

export function WorkoutSessionExerciseItem({ exercise }: Props) {
  const { completeExercise } = useActiveWorkoutSession();

  const handleToggleComplete = () => {
    completeExercise.mutate({
      workoutSessionExerciseId: exercise.id,
    });
  };

  return (
    <View className="gap-y-3">
      <View className="flex-row gap-x-2">
        <Text type="h3" className="flex-1">
          {exercise.name}
        </Text>
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
            <Text>Kg</Text>
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
