import { Link } from "expo-router";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Skeleton } from "heroui-native/skeleton";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { SECONDS } from "@/core/shared/utils/constanst";
import { timeAgo } from "@/core/shared/utils/timeago";
import { useFindActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";

export function ActiveWorkoutSessionCard() {
  const { data } = useFindActiveWorkoutSession();
  const [timeActive, setTimeActive] = useState(
    data ? timeAgo(data.startedAt) : "0",
  );

  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      setTimeActive(timeAgo(data.startedAt));
    }, SECONDS * 10);

    return () => clearInterval(interval);
  }, [data]);

  const completedWorkoutExercises =
    data?.exercises.filter((e) => e.completed).length || 0;

  if (!data) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Rutina actual</Card.Title>
      </Card.Header>
      <Card.Body className="gap-y-3">
        <View className="flex-row gap-x-2">
          <View className="px-2 bg-background rounded-xl flex-row items-center gap-x-1 py-1">
            <MaterialIcons name="av-timer" size={20} className="text-muted" />
            <Text className="text-sm text-muted">{timeActive} activa</Text>
          </View>
          <View className="px-2 bg-background rounded-xl flex-row items-center gap-x-1 py-1">
            <MaterialIcons name="list-alt" size={20} className="text-muted" />
            <Text className="text-sm text-muted">
              {completedWorkoutExercises} / {data.exercises.length} ejercicios
            </Text>
          </View>
        </View>
        <Link
          asChild
          push
          href={{
            pathname: "/session",
          }}
        >
          <Button>
            <Button.Label>Continuar con la rutina</Button.Label>
            <MaterialIcons
              name="play-circle-outline"
              size={20}
              className="text-white"
            />
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export function ActiveWorkoutSessionCardSkeleton() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Rutina actual</Card.Title>
      </Card.Header>
      <Card.Body className="gap-y-3">
        <View className="flex-row gap-x-2">
          <Skeleton className="h-7 w-1/3 rounded-xl" />
          <Skeleton className="h-7 w-1/3 rounded-xl" />
        </View>
        <Button isDisabled>
          <Button.Label>Continuar con la rutina</Button.Label>
          <MaterialIcons
            name="play-circle-outline"
            size={20}
            className="text-white"
          />
        </Button>
      </Card.Body>
    </Card>
  );
}
