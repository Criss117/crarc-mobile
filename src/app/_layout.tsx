import "@/global.css";
import "react-native-get-random-values";

import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Integrations } from "@/integrations";

export default function RootLayout() {
  const [background, accent] = useThemeColor(["background", "accent"]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Integrations>
        <Stack
          screenOptions={{
            animation: "slide_from_bottom",
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
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="exercises/[exerciseid]" />
          <Stack.Screen
            name="workouts/[workoutid]/index"
            options={{
              title: "Rutina",
            }}
          />
          <Stack.Screen
            name="workouts/create"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="workouts/[workoutid]/update"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="session/active"
            options={{
              headerTitle: "Sesión de trabajo",
            }}
          />
        </Stack>
      </Integrations>
    </GestureHandlerRootView>
  );
}
