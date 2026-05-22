import { Text } from "@/core/shared/components/text";
import { Button } from "heroui-native/button";
import { Alert, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Button onPress={() => Alert.alert("Hii")}>
        Get started by editing App.tsx
      </Button>
      <Text>Get started by editing App.tsx</Text>
    </View>
  );
}
