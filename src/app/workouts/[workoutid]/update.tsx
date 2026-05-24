import { useGlobalSearchParams } from "expo-router";
import { Text } from "heroui-native";

export default function UpdateWorkout() {
  const params = useGlobalSearchParams();

  return <Text>{JSON.stringify(params, null, 2)}</Text>;
}
