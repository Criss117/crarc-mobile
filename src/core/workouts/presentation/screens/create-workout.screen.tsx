import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { SkeletonGroup } from "heroui-native/skeleton-group";
import { Text } from "heroui-native/text";
import { ScrollView, View } from "react-native";

import { useCreateWorkout } from "@/core/workouts/application/mutations/use-create-workout";
import { useWorkoutForm } from "@/core/workouts/presentation/components/workout-form";

export function CreateWorkoutScreen() {
  const router = useRouter();
  const createWorkout = useCreateWorkout();

  const form = useWorkoutForm({
    onSubmit: (data, options) => {
      createWorkout.mutate(
        {
          values: {
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

function WorkoutFormSkeleton() {
  return (
    <ScrollView
      contentContainerClassName="px-2 gap-y-6 pb-8"
      showsVerticalScrollIndicator={false}
      accessibilityRole="none"
      accessibilityLabel="Cargando contenido"
    >
      {/* Section: Información de la rutina */}
      <View>
        <SkeletonGroup isSkeletonOnly variant="shimmer">
          <SkeletonGroup.Item className="h-7 w-56 rounded-md mb-3" />
        </SkeletonGroup>
        <View className="rounded-lg bg-background border border-muted p-4 gap-y-4"></View>
      </View>

      {/* Section: Lista de ejercicios */}
      <View>
        <SkeletonGroup isSkeletonOnly variant="shimmer">
          <SkeletonGroup.Item className="h-7 w-48 rounded-md mb-3" />
        </SkeletonGroup>
        <View className="rounded-lg bg-background border border-muted p-4 gap-y-4"></View>
      </View>
    </ScrollView>
  );
}

export function CreateWorkoutScreenSkeleton() {
  return <WorkoutFormSkeleton />;
}
