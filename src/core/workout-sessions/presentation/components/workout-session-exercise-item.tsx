import { useForm } from "@tanstack/react-form";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { Text } from "heroui-native/text";
import { View } from "react-native";
import { z } from "zod";

import { MaterialIcons } from "@/core/shared/components/icons";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";

interface Props {
  exercise: WorkoutSessionDetail["exercises"][number];
}

const setSchema = z.object({
  weight: z.coerce.number<number>().min(1),
  reps: z.coerce.number<number>().min(1),
  rir: z.coerce.number<number>().min(0),
});

function convertWeight(weight: number, displayUnit: "kg" | "lb") {
  return weight / (displayUnit === "kg" ? 1000 : 453.6);
}

export function WorkoutSessionExerciseItem({ exercise }: Props) {
  const { saveExerciseSet, toggleCompleteWorkoutSessionExercise } =
    useActiveWorkoutSession();
  const lastSetIndex = exercise.sets.length;

  const isPending =
    saveExerciseSet.isPending || toggleCompleteWorkoutSessionExercise.isPending;

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
        workoutSessionExerciseId: exercise.id,
        setIndex: lastSetIndex + 1,
        weightInUnits: value.weight,
        reps: value.reps,
        rir: value.rir,
      });

      formApi.reset();
    },
  });

  const handleToggleComplete = () => {
    toggleCompleteWorkoutSessionExercise.mutate({
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
            isDisabled={isPending}
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
            isDisabled={isPending}
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
          {exercise.sets.map((set) => (
            <View
              className="flex flex-row gap-x-1 py-2 border-b border-accent"
              key={set.setIndex + set.workoutSessionExerciseId}
            >
              <View className="flex-1 items-center justify-center">
                <Text>{set.setIndex}</Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <Text>
                  {convertWeight(set.weightInGrams, exercise.weightDisplayUnit)}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <Text>{set.reps}</Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <Text>{set.rir}</Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <Button isIconOnly variant="ghost">
                  <MaterialIcons name="edit" size={18} />
                </Button>
              </View>
            </View>
          ))}
        </View>

        {!exercise.completed && (
          <View className="flex flex-row gap-x-1 py-2">
            <View className="flex-1 items-center justify-center">
              <Text>{lastSetIndex + 1}</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <form.Field name="weight">
                {(field) => (
                  <Input
                    isDisabled={isPending}
                    className="w-full text-center"
                    keyboardType="numeric"
                    value={
                      field.state.value === 0
                        ? ""
                        : field.state.value.toString()
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
                    isDisabled={isPending}
                    className="w-full text-center"
                    keyboardType="numeric"
                    value={
                      field.state.value === 0
                        ? ""
                        : field.state.value.toString()
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
                    isDisabled={isPending}
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
                isDisabled={isPending}
              >
                <MaterialIcons name="check" size={18} className="text-white" />
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
