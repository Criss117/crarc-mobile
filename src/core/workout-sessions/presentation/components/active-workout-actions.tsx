import { useRouter } from "expo-router";
import { Dialog } from "heroui-native";
import { Button } from "heroui-native/button";
import { Popover, PopoverTriggerRef } from "heroui-native/popover";
import { useRef, useState } from "react";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import { useMutateWorkoutSessions } from "@/core/workout-sessions/application/hooks/use-mutate-workout-sessions";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";

interface Props {
  workoutSession: WorkoutSessionDetail;
}

function CancelWorkoutSession({ workoutSession }: Props) {
  const router = useRouter();
  const { remove } = useMutateWorkoutSessions();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    remove.mutate(
      { workoutSessionId: workoutSession.id },
      {
        onSuccess: () => {
          router.push({
            pathname: "/workouts",
          });
        },
      },
    );
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" className="justify-start gap-x-6">
          <MaterialIcons name="info" size={20} className="text-danger" />
          <Button.Label className="text-danger">
            Eliminar la sesión
          </Button.Label>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40" />
        <Dialog.Content className="gap-y-6">
          <Dialog.Title>¿Estás seguro de eliminar la sesión?</Dialog.Title>
          <View className="flex-row gap-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onPress={() => setIsOpen(false)}
              isDisabled={remove.isPending}
            >
              <Button.Label>Cancelar</Button.Label>
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onPress={handleDelete}
              isDisabled={remove.isPending}
            >
              <Button.Label>Eliminar</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export function ActiveWorkoutActions({ workoutSession }: Props) {
  const router = useRouter();
  const { completeWorkout } = useActiveWorkoutSession();

  const popoverRef = useRef<PopoverTriggerRef>(null);

  const hasAnyExerciseCompleted = workoutSession.exercises.some(
    (e) => e.completed,
  );

  const handleComplete = () => {
    completeWorkout.mutate(undefined, {
      onSuccess: () => {
        router.push({
          pathname: "/workouts",
        });
      },
    });
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
          contentContainerClassName="bg-background pb-20"
        >
          <View className="gap-y-4">
            <Button
              onPress={handleComplete}
              isDisabled={completeWorkout.isPending || !hasAnyExerciseCompleted}
              variant="ghost"
              className="justify-start gap-x-6"
            >
              <MaterialIcons
                name="check"
                size={20}
                className="dark:text-white"
              />
              <Button.Label>Completar la sesión</Button.Label>
            </Button>
            <CancelWorkoutSession workoutSession={workoutSession} />
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
