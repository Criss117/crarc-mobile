import { Card } from "heroui-native/card";
import { View } from "react-native";

import { useFindAllWorkoutSessions } from "@/core/workout-sessions/application/hooks/use-find-workout-sessions";
import {
  InitWorkoutSession,
  InitWorkoutSessionSkeleton,
} from "@/core/workout-sessions/presentation/components/init-workout-session";
import { SkeletonGroup } from "heroui-native";
import { Text } from "./text";

export function RecentWorkoutSessions() {
  const { data } = useFindAllWorkoutSessions();

  return (
    <View className="gap-y-5">
      <Text
        variants={{
          size: "h4",
        }}
      >
        Ultimas sesiones
      </Text>
      <View className="gap-y-4">
        {data.slice(0, 3).map((session) => (
          <Card key={session.id} className="flex-row items-end">
            <Card.Header className="flex-1">
              <Card.Title>{session.name}</Card.Title>
              <Card.Description>
                {session.totalExercises} ejercicios
              </Card.Description>
              <Card.Description>
                {session.createdAt.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Card.Description>
            </Card.Header>
            <Card.Body>
              {!!session.workoutId && (
                <InitWorkoutSession workoutId={session.workoutId} />
              )}
            </Card.Body>
          </Card>
        ))}
      </View>
    </View>
  );
}

export function RecentWorkoutSessionsSkeleton() {
  return (
    <View className="gap-y-5">
      <Text
        variants={{
          size: "h4",
        }}
      >
        Ultimas sesiones
      </Text>
      <View className="gap-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex-row items-end">
            <Card.Header className="flex-1">
              <SkeletonGroup className="gap-y-1">
                <SkeletonGroup.Item className="h-5 w-3/5" />
                <SkeletonGroup.Item className="h-3 w-4/5" />
                <SkeletonGroup.Item className="h-3 w-4/5" />
              </SkeletonGroup>
            </Card.Header>
            <Card.Body>
              <InitWorkoutSessionSkeleton />
            </Card.Body>
          </Card>
        ))}
      </View>
    </View>
  );
}
