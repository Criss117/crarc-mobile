import { useFindOneExercise } from "@/core/exercises/application/hooks/use-find-exercises";
import { GeistFonts } from "@/integrations/fonts";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
  Stack,
  useGlobalSearchParams,
  useRouter,
  withLayoutContext,
} from "expo-router";
import { useThemeColor } from "heroui-native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function ExercisesTabsLayout() {
  const router = useRouter();
  const [background, accent] = useThemeColor(["background", "accent"]);
  const params = useGlobalSearchParams<{
    exerciseid: string;
  }>();
  const { data } = useFindOneExercise({
    exerciseId: params.exerciseid,
  });

  if (!data) {
    router.replace({
      pathname: "/exercises",
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.name,
        }}
      />
      <MaterialTopTabs
        screenOptions={{
          title: data?.name,
          sceneStyle: {
            backgroundColor: background,
          },
          tabBarStyle: {
            backgroundColor: background,
          },
          tabBarLabelStyle: {
            fontFamily: GeistFonts.SemiBold,
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
            title: "Acerca de",
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
    </>
  );
}
