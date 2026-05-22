import "@/global.css";
import "react-native-random-uuid";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Integrations } from "@/integrations";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Integrations>
        <Stack />
      </Integrations>
    </GestureHandlerRootView>
  );
}
