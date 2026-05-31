import { Card } from "heroui-native/card";
import { Separator } from "heroui-native/separator";

import { ExerciseDetails } from "@/core/exercises/domain/execises.entity";
import { Text } from "@/core/shared/components/text";
import { convertWeight } from "@/core/shared/utils/convert-weight";
import { View } from "react-native";

interface Props {
  workoutSessions: ExerciseDetails["workoutSessions"][number];
}

export function WorkoutSessionExerciseInfo({ workoutSessions }: Props) {
  return (
    <Card className="gap-y-3">
      <Card.Header className="flex-row justify-between items-center">
        <Card.Title>{workoutSessions.name}</Card.Title>
        <Card.Description>
          {workoutSessions.createdAt.toLocaleDateString()}
        </Card.Description>
      </Card.Header>
      <Separator />
      <Card.Body>
        <View className="flex flex-row gap-x-1">
          <View className="flex-1 items-center justify-center">
            <Text>Set</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text>{workoutSessions.weightDisplayUnit}</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text>Reps</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text>Rir</Text>
          </View>
        </View>
        {workoutSessions.sets.map((set, index) => (
          <View
            className="flex flex-row gap-x-1 py-2 border-b border-accent"
            key={set.id}
          >
            <View className="flex-1 items-center justify-center">
              <Text>{index + 1}</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text>
                {convertWeight(
                  set.weightInGrams,
                  workoutSessions.weightDisplayUnit,
                )}
              </Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text>{set.reps}</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text>{set.rir}</Text>
            </View>
          </View>
        ))}
      </Card.Body>
    </Card>
  );
}
