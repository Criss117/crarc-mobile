import { Link, Stack } from "expo-router";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Text } from "heroui-native/text";
import { ScrollView, View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { useCreateWorkoutForm } from "@/core/workouts/presentation/components/workout-form/providers";

export function CreateWorkoutScreen() {
  const { form, isPending } = useCreateWorkoutForm();

  return (
    <ScrollView className="px-3 flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-y-4 mb-10">
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

        <Card>
          <form.AppField name="exerciseIds">
            {(field) => <field.ExercisesListField />}
          </form.AppField>
        </Card>

        <View>
          <Link
            asChild
            push
            href={{
              pathname: "/workouts/create/assign-exercises",
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
