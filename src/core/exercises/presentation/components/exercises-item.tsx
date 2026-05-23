import { useRouter } from "expo-router";
import { Card, PressableFeedback } from "heroui-native";

import type { ExerciseSummary } from "@/core/exercises/application/queries/use-find-exercises";
import { MaterialIcons } from "@/core/shared/components/icons";

interface Props {
  exercise: ExerciseSummary;
}

export function ExercisesItem({ exercise }: Props) {
  const router = useRouter();

  return (
    <PressableFeedback
      onPress={() =>
        router.push({
          pathname: "/exercises/[exerciseid]",
          params: { exerciseid: exercise.id },
        })
      }
    >
      <Card className="flex-row gap-x-4 items-center">
        <Card.Header className="flex-1">
          <Card.Title>{exercise.name}</Card.Title>
          <Card.Description className="text-sm line-clamp-1">
            {exercise.muscles.map((m) => m.name).join(", ")}
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <MaterialIcons
            name="arrow-forward-ios"
            size={18}
            className="text-muted"
          />
        </Card.Body>
      </Card>
    </PressableFeedback>
  );
}
