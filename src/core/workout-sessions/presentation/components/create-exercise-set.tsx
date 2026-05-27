import { useForm } from "@tanstack/react-form";
import { Button, Input } from "heroui-native";
import { View } from "react-native";
import { z } from "zod";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";

interface Props {
  exerciseId: string;
  completed: boolean;
  exerciseSetsLength: number;
}

const setSchema = z.object({
  weight: z.coerce.number<number>().min(1),
  reps: z.coerce.number<number>().min(1),
  rir: z.coerce.number<number>().min(0),
});

export function CreateExerciseSet({
  exerciseId,
  completed,
  exerciseSetsLength,
}: Props) {
  const { saveExerciseSet } = useActiveWorkoutSession();

  const form = useForm({
    defaultValues: {
      weight: 0,
      reps: 0,
      rir: 0,
    },
    validators: {
      onSubmit: setSchema,
    },
    onSubmit: ({ value, formApi }) => {
      saveExerciseSet.mutate({
        workoutSessionExerciseId: exerciseId,
        weightInUnits: value.weight,
        reps: value.reps,
        rir: value.rir,
      });

      formApi.reset();
    },
  });

  if (completed) return null;

  return (
    <View className="flex flex-row gap-x-1 py-2">
      <View className="flex-1 items-center justify-center">
        <Text>{exerciseSetsLength + 1}</Text>
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
          <MaterialIcons name="check" size={18} className="text-white" />
        </Button>
      </View>
    </View>
  );
}
