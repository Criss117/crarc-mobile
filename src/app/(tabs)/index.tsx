import { Link } from "expo-router";
import { Button } from "heroui-native/button";
import { Suspense } from "react";
import { ScrollView, View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import {
  RecentWorkoutSessions,
  RecentWorkoutSessionsSkeleton,
} from "@/core/shared/components/recent-workout-sessions";
import {
  ActiveWorkoutSessionCard,
  ActiveWorkoutSessionCardSkeleton,
} from "@/core/workout-sessions/presentation/components/active-workout-session-card";

export default function Home() {
  return (
    <ScrollView className="flex-1 px-3" contentContainerClassName="gap-y-8">
      <Suspense fallback={<ActiveWorkoutSessionCardSkeleton />}>
        <ActiveWorkoutSessionCard />
      </Suspense>
      <View className="flex-row gap-x-2 justify-between">
        <Link
          href={{
            pathname: "/workouts/create",
          }}
          push
          asChild
        >
          <Button className="flex-1 flex-col h-20" variant="outline">
            <MaterialIcons
              name="add-circle-outline"
              size={28}
              className="text-accent"
            />
            <Button.Label>Crear rutina</Button.Label>
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/exercises",
          }}
          push
          asChild
        >
          <Button className="flex-1 flex-col h-20" variant="outline">
            <MaterialIcons name="search" size={28} className="text-accent" />
            <Button.Label>Explorar</Button.Label>
          </Button>
        </Link>
      </View>

      <Suspense fallback={<RecentWorkoutSessionsSkeleton />}>
        <RecentWorkoutSessions />
      </Suspense>
    </ScrollView>
  );
}
