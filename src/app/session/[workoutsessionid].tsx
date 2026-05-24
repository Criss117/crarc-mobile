import { useLocalSearchParams } from "expo-router";
import { Text } from "heroui-native/text";

export default function WorkoutSession() {
  const params = useLocalSearchParams<{
    workoutsessionid: string;
  }>();

  return <Text>{JSON.stringify(params)}</Text>;
}
