import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { useState } from "react";
import { View } from "react-native";
import { z } from "zod";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { convertWeight } from "@/core/shared/utils/convert-weight";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";
import { useSetForm } from "./exercises-set-form";

interface Props {
  completed: boolean;
  weightDisplayUnit: "kg" | "lb";
  set: WorkoutSessionDetail["exercises"][number]["sets"][number];
  exerciseId: string;
  index: number;
  exerciseSetsLength: number;
}

interface ItemProps extends Props {
  handleEdit: () => void;
  handleCancel: () => void;
}

const setSchema = z.object({
  weight: z.coerce.number<number>().min(1),
  reps: z.coerce.number<number>().min(1),
  rir: z.coerce.number<number>().min(0),
});

function ExerciseSetItem({
  set,
  index,
  weightDisplayUnit,
  completed,
  handleEdit,
}: ItemProps) {
  return (
    <View
      className="flex flex-row gap-x-1 py-2 border-b border-accent"
      key={set.id}
    >
      <View className="flex-1 items-center justify-center">
        <Text>{index + 1}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text>{convertWeight(set.weightInGrams, weightDisplayUnit)}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text>{set.reps}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text>{set.rir}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Button
          isIconOnly
          variant="ghost"
          onPress={handleEdit}
          isDisabled={completed}
        >
          <MaterialIcons name="edit" size={18} />
        </Button>
      </View>
    </View>
  );
}

function ExerciseSetItemForm({
  set,
  weightDisplayUnit,
  exerciseId,
  index,
  handleCancel,
}: ItemProps) {
  const { saveExerciseSet } = useActiveWorkoutSession();
  const form = useSetForm({
    workoutSessionExerciseId: exerciseId,
    defaultValues: {
      weight: convertWeight(set.weightInGrams, weightDisplayUnit),
      reps: set.reps,
      rir: set.rir,
      setId: set.id,
    },
    options: {
      onSuccess: () => handleCancel(),
    },
  });

  return (
    <View className="flex flex-row gap-x-1 py-2 border-b border-accent">
      <View className="flex-1 items-center justify-center">
        <Text>{index + 1}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <form.Field name="weight">
          {(field) => (
            <Input
              isDisabled={saveExerciseSet.isPending}
              className="w-full text-center"
              keyboardType="numeric"
              value={
                field.state.value === 0 ? "" : field.state.value.toString()
              }
              onBlur={field.handleBlur}
              placeholder="0"
              onChangeText={(v) => field.handleChange(Number(v))}
            />
          )}
        </form.Field>
      </View>
      <View className="flex-1 items-center justify-center">
        <form.Field name="reps">
          {(field) => (
            <Input
              isDisabled={saveExerciseSet.isPending}
              className="w-full text-center"
              keyboardType="numeric"
              value={
                field.state.value === 0 ? "" : field.state.value.toString()
              }
              placeholder="0"
              onBlur={field.handleBlur}
              onChangeText={(v) => field.handleChange(Number(v))}
            />
          )}
        </form.Field>
      </View>
      <View className="flex-1 items-center justify-center">
        <form.Field name="rir">
          {(field) => (
            <Input
              isDisabled={saveExerciseSet.isPending}
              className="w-full text-center"
              keyboardType="numeric"
              value={field.state.value.toString()}
              placeholder="0"
              onBlur={field.handleBlur}
              onChangeText={(v) => field.handleChange(Number(v))}
            />
          )}
        </form.Field>
      </View>
      <View className="flex-1 items-center justify-center">
        <Button
          isIconOnly
          onPress={() => form.handleSubmit()}
          isDisabled={saveExerciseSet.isPending}
        >
          <MaterialIcons name="save" size={18} className="text-white" />
        </Button>
      </View>
    </View>
  );
}

export function UpdateExerciseSet(props: Props) {
  const [updating, setUpdating] = useState(false);

  const handleEdit = () => {
    setUpdating(true);
  };

  const handleCancel = () => {
    setUpdating(false);
  };

  if (updating)
    return (
      <ExerciseSetItemForm
        {...props}
        handleEdit={handleEdit}
        handleCancel={handleCancel}
      />
    );

  return (
    <ExerciseSetItem
      {...props}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
    />
  );
}
