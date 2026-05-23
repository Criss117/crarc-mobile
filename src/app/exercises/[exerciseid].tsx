import { Text } from "@/core/shared/components/text";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseDetail() {
  const params = useLocalSearchParams();

  return <Text>{JSON.stringify(params, null, 2)}</Text>;
}
