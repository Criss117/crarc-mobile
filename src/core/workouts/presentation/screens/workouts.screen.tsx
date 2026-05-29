import { useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Button } from "heroui-native/button";
import { Suspense } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { findActiveWorkoutSessionQueryOptions } from "@/core/workout-sessions/application/hooks/use-find-workout-sessions";
import {
  ActiveWorkoutSessionCard,
  ActiveWorkoutSessionCardSkeleton,
} from "@/core/workout-sessions/presentation/components/active-workout-session-card";
import { useFindWorkouts } from "@/core/workouts/application/hooks/use-find-workouts";
import {
  WorkoutCard,
  WorkoutCardSkeleton,
} from "@/core/workouts/presentation/components/workout-card";

export function WorkoutsScreen() {
  const queryClient = useQueryClient();
  const { data, refetch, isRefetching } = useFindWorkouts();

  const handleRefresh = () => {
    refetch();
    queryClient.refetchQueries(findActiveWorkoutSessionQueryOptions);
  };

  return (
    <View className="px-3 flex-1">
      <FlatList
        className="flex-1"
        contentContainerClassName="flex-1"
        data={data}
        keyExtractor={(w) => w.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        ListHeaderComponent={
          <View>
            <Suspense fallback={<ActiveWorkoutSessionCardSkeleton />}>
              <ActiveWorkoutSessionCard />
            </Suspense>
            <View className="py-3">
              <Text variants={{ size: "h5" }}>Mis Rutinas</Text>
            </View>
          </View>
        }
        ItemSeparatorComponent={<View className="h-4" />}
        ListEmptyComponent={
          <View className="items-center gap-y-2 ">
            <Text className="text-muted" variants={{ size: "h4" }}>
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
  return (
    <View
      className="px-3"
      accessibilityRole="none"
      accessibilityLabel="Cargando contenido"
    >
      <View className="py-3">
        <Text variants={{ size: "h5" }}>Mis Rutinas</Text>
      </View>

      <View className="gap-y-4">
        <WorkoutCardSkeleton />
        <WorkoutCardSkeleton />
        <WorkoutCardSkeleton />
      </View>
    </View>
  );
}
