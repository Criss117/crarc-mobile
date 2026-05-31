import { Link, Tabs } from "expo-router";
import { cn, useThemeColor } from "heroui-native";
import { Button } from "heroui-native/button";
import { Tabs as HeroTabs } from "heroui-native/tabs";
import { useMemo, type ComponentProps } from "react";
import { StatusBar, View } from "react-native";
import { useUniwind } from "uniwind";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";

const Routes = {
  index: { Icon: "home", title: "Inicio" },
  workouts: { Icon: "fitness-center", title: "Workouts" },
  exercises: { Icon: "list-alt", title: "Ejercicios" },
  profile: { Icon: "person", title: "Perfil" },
} as const;

interface TabHeaderProps {
  route: (typeof Routes)[keyof typeof Routes];
}

function TabHeader({ route }: TabHeaderProps) {
  return (
    <View className="flex-row items-center gap-x-2">
      <MaterialIcons name={route.Icon} size={24} className="text-accent" />
      <Text className="text-accent dark:text-accent" variants={{ size: "h5" }}>
        {route.title}
      </Text>
    </View>
  );
}

type BottomTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

function BottomTabs(props: BottomTabBarProps) {
  const [accent, muted] = useThemeColor(["success", "muted"]);

  const currentRoute = useMemo(
    () => props.state.routes[props.state.index],
    [props.state.routes, props.state.index],
  );

  return (
    <HeroTabs
      value={currentRoute.key}
      onValueChange={() => {}}
      className="absolute py-2 px-5 inset-x-0 bottom-0"
    >
      <HeroTabs.List className="rounded-full">
        <HeroTabs.Indicator className="rounded-full" />
        {props.state.routes.map((r) => (
          <HeroTabs.Trigger
            value={r.key}
            key={r.key}
            className="flex-col gap-y-0 rounded-full flex-1"
            onPress={() => props.navigation.navigate(r.name)}
          >
            {({ isSelected }) => (
              <>
                <MaterialIcons
                  color={isSelected ? accent : muted}
                  name={Routes[r.name as keyof typeof Routes].Icon}
                  size={24}
                />
                <HeroTabs.Label
                  className={cn(
                    "text-[10px]",
                    isSelected ? "text-success" : "text-muted",
                  )}
                >
                  {Routes[r.name as keyof typeof Routes].title}
                </HeroTabs.Label>
              </>
            )}
          </HeroTabs.Trigger>
        ))}
      </HeroTabs.List>
    </HeroTabs>
  );
}

export default function TabsLayout() {
  const { theme } = useUniwind();
  const [background, accent] = useThemeColor(["background", "accent"]);

  return (
    <>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <Tabs
        tabBar={(props) => <BottomTabs {...props} />}
        screenOptions={{
          animation: "shift",
          sceneStyle: {
            backgroundColor: background,
          },
          headerStyle: {
            backgroundColor: background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: accent,
          },
          tabBarActiveTintColor: accent,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: () => <TabHeader route={Routes.index} />,
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            headerTitle: () => <TabHeader route={Routes.workouts} />,
            headerRight: () => (
              <Link asChild push href="/workouts/create">
                <Button
                  isIconOnly
                  variant="outline"
                  size="sm"
                  className="rounded-full mr-4 bg-background-tertiary"
                >
                  <MaterialIcons name="add" size={24} className="text-accent" />
                </Button>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="exercises"
          options={{
            headerTitle: () => <TabHeader route={Routes.exercises} />,
          }}
        />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
