import { Link, Stack, useRouter } from "expo-router";
import { PressableFeedback, useThemeColor } from "heroui-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { View } from "react-native";

export default function SessionLayout() {
  const router = useRouter();
  const [background, accent] = useThemeColor(["background", "accent"]);

  return (
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
        headerTitle: "",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <View className="gap-x-6 flex-row">
              <PressableFeedback onPress={router.back}>
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  className="text-accent"
                />
              </PressableFeedback>
              <Link
                href={{
                  pathname: "/session/rest-pause",
                }}
                push
              >
                <MaterialIcons
                  name="access-time"
                  size={24}
                  className="text-accent"
                />
              </Link>
            </View>
          ),
        }}
      />
      <Stack.Screen name="rest-pause" />
    </Stack>
  );
}
