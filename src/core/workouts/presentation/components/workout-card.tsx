import { Link } from "expo-router";
import { Dialog, Separator, SkeletonGroup, Text } from "heroui-native";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Popover, PopoverTriggerRef } from "heroui-native/popover";
import { useRef, useState } from "react";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import {
  InitWorkoutSession,
  InitWorkoutSessionSkeleton,
} from "@/core/workout-sessions/presentation/components/init-workout-session";
import { useRemoveWorkout } from "@/core/workouts/application/mutations/use-remove-workout";
import type { WorkoutSummary } from "@/core/workouts/application/queries/use-find-workouts";

interface Props {
  workout: WorkoutSummary;
}

function RemoveWorkout({ workout }: Props) {
  const removeWorkout = useRemoveWorkout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" className="justify-start gap-x-6">
          <MaterialIcons name="delete" size={20} className="dark:text-white" />
          <Button.Label>Eliminar</Button.Label>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40" />
        <Dialog.Content className="gap-y-4">
          <Dialog.Title>
            ¿Estás seguro de que quieres eliminar "{workout.name}"?
          </Dialog.Title>
          <Button
            variant="danger"
            onPress={() => removeWorkout.mutate(workout.id)}
            isDisabled={removeWorkout.isPending}
          >
            <Button.Label>Eliminar</Button.Label>
          </Button>
          <Button variant="outline" onPress={() => setIsOpen(false)}>
            <Button.Label>Cancelar</Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

function WorkoutCardOptions({ workout }: Props) {
  const popoverRef = useRef<PopoverTriggerRef>(null);

  const closePopover = () => {
    if (popoverRef.current) popoverRef.current.close();
  };

  return (
    <Popover presentation="bottom-sheet">
      <Popover.Trigger asChild ref={popoverRef}>
        <Button variant="ghost" isIconOnly>
          <MaterialIcons
            name="more-horiz"
            size={20}
            className="dark:text-white"
          />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay className="bg-black/40" />
        <Popover.Content
          presentation="bottom-sheet"
          contentContainerClassName="bg-background"
        >
          <View className="gap-y-2 mb-14">
            <View>
              <Text type="h4">{workout.name}</Text>
              <Text>{workout.description || "-"}</Text>
            </View>
            <Separator />
            <View className="gap-y-1">
              <Link
                asChild
                push
                href={{
                  pathname: "/workouts/[workoutid]",
                  params: {
                    workoutid: workout.id,
                  },
                }}
              >
                <Button
                  variant="ghost"
                  className="justify-start gap-x-6"
                  onPress={closePopover}
                >
                  <MaterialIcons
                    name="info"
                    size={20}
                    className="dark:text-white"
                  />
                  <Button.Label>Ver Detalle</Button.Label>
                </Button>
              </Link>
              <Link
                asChild
                push
                href={{
                  pathname: "/workouts/[workoutid]/update",
                  params: {
                    workoutid: workout.id,
                  },
                }}
              >
                <Button
                  variant="ghost"
                  className="justify-start gap-x-6"
                  onPress={closePopover}
                >
                  <MaterialIcons
                    name="edit"
                    size={20}
                    className="dark:text-white"
                  />
                  <Button.Label>Editar</Button.Label>
                </Button>
              </Link>
              <RemoveWorkout workout={workout} />
            </View>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

export function WorkoutCard({ workout }: Props) {
  return (
    <Card>
      <Card.Header className="flex-row items-start">
        <View className="flex-1">
          <Card.Title>{workout.name}</Card.Title>
          <Card.Description>{workout.description || "-"}</Card.Description>
          <Card.Description>
            {workout.exercises.length} ejercicios
          </Card.Description>
        </View>
        <WorkoutCardOptions workout={workout} />
      </Card.Header>
      <Card.Body className="flex-row justify-between">
        <View></View>
        <InitWorkoutSession workoutId={workout.id} />
      </Card.Body>
    </Card>
  );
}

export function WorkoutCardSkeleton() {
  return (
    <Card>
      <Card.Header className="flex-row items-start">
        <View className="flex-1">
          <SkeletonGroup variant="shimmer" className="gap-y-1">
            <SkeletonGroup.Item className="h-6 w-3/5 rounded-md" />
            <SkeletonGroup.Item className="h-4 w-4/5 rounded-md" />
            <SkeletonGroup.Item className="h-4 w-1/3 rounded-md" />
          </SkeletonGroup>
        </View>
        <Button variant="ghost" isIconOnly isDisabled>
          <MaterialIcons
            name="more-horiz"
            size={20}
            className="dark:text-white"
          />
        </Button>
      </Card.Header>
      <Card.Body className="flex-row justify-between">
        <View></View>
        <InitWorkoutSessionSkeleton />
      </Card.Body>
    </Card>
  );
}
