import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./text";

export function ScreenHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <View
      className="bg-background-tertiary"
      style={{
        paddingTop: top,
      }}
    >
      <Text>Header</Text>
    </View>
  );
}
