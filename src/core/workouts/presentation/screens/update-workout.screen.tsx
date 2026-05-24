import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Text } from "heroui-native/text";
import { ScrollView, View } from "react-native";

import { useUpdateWorkout } from "@/core/workouts/application/mutations/use-update-workout";
import type { WorkoutDetail } from "@/core/workouts/application/queries/use-find-one-workout";
import { useWorkoutForm } from "@/core/workouts/presentation/components/workout-form";

interface Props {
  workout: WorkoutDetail;
}

export function UpdateWorkoutScreen({ workout }: Props) {
  const router = useRouter();
  const updateWorkout = useUpdateWorkout();

  const form = useWorkoutForm({
    defaultValues: {
      name: workout.name,
      description: workout.description || "",
      exercises: workout.exercises.map((e) => ({
        id: e.exerciseId,
      })),
      workoutId: workout.id,
    },
    onSubmit: (data, options) => {
      updateWorkout.mutate(
        {
          values: {
            id: workout.id,
            name: data.name,
            description: data.description,
            exercises: data.exercises.map((e, index) => ({
              exerciseId: e.id,
              orderIndex: index,
            })),
          },
        },
        {
          onSuccess: () => {
            options.resetForm();
            router.replace({
              pathname: "/workouts",
            });
          },
        },
      );
    },
  });

  return (
    <ScrollView
      contentContainerClassName="px-2 gap-y-6 pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text type="h3">Información de la rutina</Text>
        <Card>
          <Card.Body className="gap-y-3">
            <form.AppField name="name">
              {(field) => <field.NameField />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.DescriptionField />}
            </form.AppField>
          </Card.Body>
        </Card>
      </View>

      <View>
        <Text type="h3">Lista de ejercicios</Text>
        <Card>
          <Card.Body className="gap-y-3">
            <form.AppField name="exercises">
              {(field) => <field.AddExercisesField />}
            </form.AppField>
            <form.AppField name="exercises">
              {(field) => <field.ExercisesListField />}
            </form.AppField>
          </Card.Body>
        </Card>
      </View>

      <Stack.Screen
        options={{
          headerRight: () => (
            <Button variant="outline" size="sm" onPress={form.handleSubmit}>
              <Button.Label className="text-accent">Guardar</Button.Label>
            </Button>
          ),
        }}
      />
    </ScrollView>
  );
}

export function UpdateWorkoutScreenSkeleton() {
  return null;
}
