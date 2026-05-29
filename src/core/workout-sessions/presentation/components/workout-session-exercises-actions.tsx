import { BottomSheet } from "heroui-native/bottom-sheet";
import { Button } from "heroui-native/button";
import { Dialog } from "heroui-native/dialog";
import { RadioGroup } from "heroui-native/radio-group";
import { Separator } from "heroui-native/separator";
import { useState } from "react";
import { View } from "react-native";

import { MaterialIcons } from "@/core/shared/components/icons";
import { Text } from "@/core/shared/components/text";
import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import type { WorkoutSessionDetail } from "@/core/workout-sessions/domain/workout-session.entity";

type Exercise = WorkoutSessionDetail["exercises"][number];

interface Props {
  exercise: Exercise | null;
  unselectExercise: () => void;
}

function DeleteExercise({ exercise, unselectExercise }: Props) {
  const { deleteExercise } = useActiveWorkoutSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (!exercise) return;

    deleteExercise.mutate(
      {
        workoutSessionExerciseId: exercise.id,
        workoutSessionId: exercise.workoutSessionId,
      },
      {
        onSuccess: () => {
          unselectExercise();
        },
      },
    );

    setIsOpen(false);
  };

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
            ¿Estás seguro de que quieres eliminar "{exercise?.name}"?
          </Dialog.Title>
          <Button
            variant="danger"
            onPress={handleDelete}
            isDisabled={deleteExercise.isPending}
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

function ChangeWeightUnit({ exercise, unselectExercise }: Props) {
  const [selection, setSelection] = useState<"kg" | "lb">(
    exercise?.weightDisplayUnit || "kg",
  );
  const [isOpen, setIsOpen] = useState(false);
  const { changeExerciseWeightUnit } = useActiveWorkoutSession();

  const handleChange = () => {
    if (!exercise) return;

    changeExerciseWeightUnit.mutate(
      {
        workoutSessionExerciseId: exercise.id,
        workoutSessionId: exercise.workoutSessionId,
        newWeightUnit: selection,
      },
      {
        onSuccess: () => {
          unselectExercise();
        },
      },
    );

    setIsOpen(false);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" className="justify-start gap-x-6">
          <MaterialIcons name="balance" size={20} className="dark:text-white" />
          <Button.Label>Unidad ({exercise?.weightDisplayUnit})</Button.Label>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40" />
        <Dialog.Content className="gap-y-4">
          <Dialog.Title>
            Selecciona la unidad de peso para {exercise?.name}
          </Dialog.Title>
          <Dialog.Description>
            El cambio de unidad solo afectará a como se muestra la información
            en pantalla, el peso asociado a la entrada no se modificará.
          </Dialog.Description>

          <RadioGroup
            value={selection}
            onValueChange={(v) => setSelection(v as "kg" | "lb")}
          >
            <RadioGroup.Item value="kg">Kg</RadioGroup.Item>
            <RadioGroup.Item value="lb">Lb</RadioGroup.Item>
          </RadioGroup>

          <Button
            onPress={handleChange}
            isDisabled={changeExerciseWeightUnit.isPending}
          >
            <Button.Label>Guardar Cambios</Button.Label>
          </Button>
          <Button variant="outline" onPress={() => setIsOpen(false)}>
            <Button.Label>Cancelar</Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export function WorkoutSessionExercisesActions({
  exercise,
  unselectExercise,
}: Props) {
  return (
    <BottomSheet
      isOpen={exercise !== null}
      onOpenChange={(v) => {
        if (!v) unselectExercise();
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="gap-y-2 mb-14">
            <View>
              <Text variants={{ size: "h4" }}>{exercise?.name}</Text>
            </View>
            <Separator />
            <View className="gap-y-1">
              <ChangeWeightUnit
                exercise={exercise}
                unselectExercise={unselectExercise}
              />
              <DeleteExercise
                exercise={exercise}
                unselectExercise={unselectExercise}
              />
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
