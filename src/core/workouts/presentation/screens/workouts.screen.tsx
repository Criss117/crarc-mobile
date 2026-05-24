import { Link } from "expo-router";
import { Button } from "heroui-native/button";
import { Text } from "heroui-native/text";
import { FlatList, View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { useFindWorkouts } from "@/core/workouts/application/queries/use-find-workouts";
import { WorkoutCard } from "@/core/workouts/presentation/components/workout-card";

export function WorkoutsScreen() {
  const { data } = useFindWorkouts();

  return (
    <View className="px-3">
      <FlatList
        data={data}
        keyExtractor={(w) => w.id}
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        ListHeaderComponent={
          <View className="py-3">
            <Text type="h5">Mis Rutinas</Text>
          </View>
        }
        ItemSeparatorComponent={<View className="h-4" />}
        ListEmptyComponent={
          <View className="items-center gap-y-2 ">
            <Text className="text-muted" type="h4">
              No hay workouts
            </Text>
            <Link asChild push href="/workouts/create">
              <Button>
                <MaterialIcons
                  name="add-circle-outline"
                  size={20}
                  className="text-white"
                />
                <Button.Label>Crear Workout</Button.Label>
              </Button>
            </Link>
          </View>
        }
      />
    </View>
  );
}

export function WorkoutsScreenSkeleton() {
  return null;
}
