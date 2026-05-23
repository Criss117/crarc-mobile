import { Text } from "@/core/shared/components/text";
import { Pressable, View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

const themes = [
  { name: "light", label: "Light", icon: "☀️" },
  { name: "dark", label: "Dark", icon: "🌙" },
  { name: "system", label: "System", icon: "⚙️" },
] as const;

export default function Home() {
  const { theme, hasAdaptiveThemes } = useUniwind();

  const activeTheme = hasAdaptiveThemes ? "system" : theme;

  return (
    <View className="p-4 gap-4">
      <Text className="text-sm text-gray-600 dark:text-gray-300">
        Current: {activeTheme}
      </Text>

      <View className="flex-row gap-2">
        {themes.map((t) => (
          <Pressable
            key={t.name}
            onPress={() => Uniwind.setTheme(t.name)}
            className={`
              px-4 py-3 rounded-lg items-center
              ${
                activeTheme === t.name
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }
            `}
          >
            <Text className="text-2xl mb-1">{t.icon}</Text>
            <Text
              className={`text-xs ${
                activeTheme === t.name
                  ? "text-white"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
