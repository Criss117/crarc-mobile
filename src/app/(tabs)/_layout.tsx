import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { cn, useThemeColor } from "heroui-native";
import { Tabs as HeroTabs } from "heroui-native/tabs";
import { useState } from "react";

import { MaterialIcons } from "@/core/shared/components/icons";
import { StatusBar } from "react-native";
import { useUniwind } from "uniwind";

const Routes = {
  index: { Icon: "home", title: "Inicio" },
  workouts: { Icon: "fitness-center", title: "Workouts" },
  exercises: { Icon: "list-alt", title: "Ejercicios" },
  profile: { Icon: "person", title: "Perfil" },
} as const;

function BottomTabs(props: BottomTabBarProps) {
  const [accent, muted] = useThemeColor(["success", "muted"]);
  const [activeTab, setActiveTab] = useState(props.state.routes[0].key);

  return (
    <HeroTabs
      value={activeTab}
      onValueChange={setActiveTab}
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
            {({ isSelected, value, isDisabled }) => (
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
          headerTitleStyle: {
            color: accent,
          },
          tabBarActiveTintColor: accent,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="workouts" />
        <Tabs.Screen
          name="exercises"
          options={{
            headerTitle: "Ejercicios",
          }}
        />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
