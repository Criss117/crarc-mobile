import { Button } from "heroui-native/button";
import { ScrollView, View } from "react-native";

import { useFindExercises } from "@/core/exercises/application/queries/use-find-exercises";
import { Text } from "@/core/shared/components/text";

export default function Index() {
  const { data, refetch } = useFindExercises();

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Button onPress={() => refetch()}>Refetch</Button>
      <ScrollView>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
    </View>
  );
}
