import { useRouter } from "expo-router";
import { Card, PressableFeedback, SkeletonGroup } from "heroui-native";

import type { ExerciseSummary } from "@/core/exercises/application/actions/queries/use-find-exercises";
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

export function ExercisesItemSkeleton() {
  return (
    <Card className="flex-row gap-x-4 items-center">
      <Card.Header className="flex-1 gap-y-1">
        <SkeletonGroup className="gap-y-1">
          <SkeletonGroup.Item className="h-5 w-3/5 rounded-md" />
          <SkeletonGroup.Item className="h-4 w-4/5 rounded-md" />
        </SkeletonGroup>
      </Card.Header>
      <Card.Body>
        <MaterialIcons
          name="arrow-forward-ios"
          size={18}
          className="text-muted"
        />
      </Card.Body>
    </Card>
  );
}
