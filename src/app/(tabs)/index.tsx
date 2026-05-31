import { ScrollView } from "react-native";

import { Text } from "@/core/shared/components/text";
import { useFindAllWorkoutSessions } from "@/core/workout-sessions/application/hooks/use-find-workout-sessions";

export default function Home() {
  const { data } = useFindAllWorkoutSessions();

  return (
    <ScrollView>
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </ScrollView>
  );
}
