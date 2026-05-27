import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";

import { UpdateWorkoutFormProvider } from "@/core/workouts/presentation/components/workout-form/providers";

export default function WorkoutsLayout() {
  const [background, accent] = useThemeColor(["background", "accent"]);

  return (
    <UpdateWorkoutFormProvider>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: background,
          },
          headerStyle: {
            backgroundColor: background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: accent,
          },
          headerTintColor: accent,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Modificar Rutina" }} />
        <Stack.Screen
          name="assign-exercises"
          options={{ title: "Seleccionar ejercicios" }}
        />
      </Stack>
    </UpdateWorkoutFormProvider>
  );
}
