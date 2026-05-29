import { Link, Stack } from "expo-router";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { SkeletonGroup } from "heroui-native/skeleton-group";
import { useLayoutEffect } from "react";
import { ScrollView, View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { SELECTED_EXERCISES_HEIGHT } from "@/core/shared/utils/constanst";
import type { WorkoutDetail } from "@/core/workouts/domain/workout.entity";
import { useUpdateWorkoutForm } from "@/core/workouts/presentation/components/workout-form/providers";

interface Props {
  workout: WorkoutDetail;
}

export function UpdateWorkoutScreen({ workout }: Props) {
  const { form, setDefaultValues, isPending } = useUpdateWorkoutForm();

  useLayoutEffect(() => {
    setDefaultValues({
      name: workout.name,
      description: workout.description || "",
      workoutId: workout.id,
      exercises: workout.exercises.map((e) => ({
        id: e.id,
        name: e.name,
        muscles: e.muscles.map((m) => m.name),
        image: e.image,
      })),
    });
  }, [workout]);

  return (
    <ScrollView className="px-3 flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-y-4 mb-10">
        <Text variants={{ size: "h3" }}>Información de la rutina</Text>
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

        <Card>
          <form.AppField name="exercises">
            {(field) => <field.ExercisesListField />}
          </form.AppField>
        </Card>

        <View>
          <Link
            asChild
            push
            href={{
              pathname: "/workouts/[workoutid]/update/assign-exercises",
              params: {
                workoutid: workout.id,
              },
            }}
          >
            <Button variant="secondary" className="items-center">
              <Button.Label>Agregar ejercicios</Button.Label>
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                className="text-accent"
              />
            </Button>
          </Link>
        </View>

        <Stack.Screen
          options={{
            headerRight: () => (
              <Button
                variant="outline"
                size="sm"
                onPress={form.handleSubmit}
                isDisabled={isPending}
              >
                <Button.Label className="text-accent">Guardar</Button.Label>
              </Button>
            ),
          }}
        />
      </View>
    </ScrollView>
  );
}

export function UpdateWorkoutScreenSkeleton() {
  return (
    <ScrollView className="px-3 flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-y-4 mb-10">
        <Text variants={{ size: "h3" }}>Información de la rutina</Text>
        <Card>
          <Card.Body className="gap-y-3">
            <SkeletonGroup>
              <SkeletonGroup.Item className="h-8 w-full rounded-md mb-3" />
              <SkeletonGroup.Item className="h-24 w-full rounded-md mb-3" />
            </SkeletonGroup>
          </Card.Body>
        </Card>

        <Card>
          <SkeletonGroup>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonGroup.Item
                className="w-full rounded-md mb-3"
                key={index}
                style={{
                  height: SELECTED_EXERCISES_HEIGHT,
                }}
              />
            ))}
          </SkeletonGroup>
        </Card>

        <View>
          <Button variant="secondary" className="items-center" isDisabled>
            <Button.Label>Agregar ejercicios</Button.Label>
            <MaterialIcons
              name="arrow-forward-ios"
              size={14}
              className="text-accent"
            />
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
