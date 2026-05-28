import { useActiveWorkoutSession } from "@/core/workout-sessions/application/hooks/use-active-workout";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Input } from "heroui-native/input";
import { z } from "zod";

const setSchema = z.object({
  weight: z.coerce.number<number>().min(1),
  reps: z.coerce.number<number>().min(1),
  rir: z.coerce.number<number>().min(0),
});

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { SetField },
  formComponents: {},
});

function SetField() {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Input
      className="w-full text-center"
      keyboardType="numeric"
      value={field.state.value.toString()}
      placeholder="0"
      onBlur={field.handleBlur}
      onChangeText={(v) => field.handleChange(Number(v))}
    />
  );
}

interface Props {
  defaultValues?: {
    setId: string;
    weight: number;
    reps: number;
    rir: number | null;
  };
  workoutSessionExerciseId: string;
  options?: {
    onSuccess?: () => void;
  };
}

export function useSetForm({
  defaultValues,
  workoutSessionExerciseId,
  options,
}: Props) {
  const { saveExerciseSet } = useActiveWorkoutSession();

  return useAppForm({
    defaultValues: {
      weight: defaultValues?.weight || 0,
      reps: defaultValues?.reps || 0,
      rir: defaultValues?.rir || 0,
    },
    validators: {
      onSubmit: setSchema,
    },
    onSubmit: ({ value, formApi }) => {
      saveExerciseSet.mutate(
        {
          workoutSessionExerciseId: workoutSessionExerciseId,
          setId: defaultValues?.setId || "",
          weightInUnits: value.weight,
          reps: value.reps,
          rir: value.rir,
        },
        {
          onSuccess: () => {
            options?.onSuccess?.();
            formApi.reset();
          },
        },
      );
    },
  });
}
