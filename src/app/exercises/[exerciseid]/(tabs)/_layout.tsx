import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { useThemeColor } from "heroui-native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function ExercisesTabsLayout() {
  const [background, accent] = useThemeColor(["background", "accent"]);

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: background,
        },
        tabBarLabelStyle: {
          fontFamily: "geist-medium",
        },
        tabBarActiveTintColor: accent,
        tabBarIndicatorStyle: {
          backgroundColor: accent,
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: "Geist",
        }}
      />
      <MaterialTopTabs.Screen
        name="history"
        options={{
          title: "Historial",
        }}
      />
      <MaterialTopTabs.Screen
        name="progress"
        options={{
          title: "Progreso",
        }}
      />
    </MaterialTopTabs>
  );
}
