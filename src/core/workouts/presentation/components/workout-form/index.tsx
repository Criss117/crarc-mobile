import { createFormHook } from "@tanstack/react-form";
import { z } from "zod";

import {
  DescriptionField,
  ExercisesListField,
  fieldContext,
  formContext,
  NameField,
} from "./field";

const workoutSchema = z.object({
  name: z
    .string()
    .min(5, {
      error: "El nombre es muy corto",
    })
    .max(50, {
      error: "El nombre es muy largo",
    }),
  description: z.string(),
  exerciseIds: z.array(z.string()).min(1, {
    error: "Debes seleccionar al menos un ejercicio",
  }),
});

export type WorkoutFormData = z.infer<typeof workoutSchema>;

interface UseWorkoutFormOptions {
  onSubmit: (data: WorkoutFormData, options: { resetForm: () => void }) => void;
}

const defaultValues: WorkoutFormData = {
  name: "",
  description: "",
  exerciseIds: [],
};

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NameField,
    DescriptionField,
    ExercisesListField,
  },
  formComponents: {},
});

export function useWorkoutForm(options: UseWorkoutFormOptions) {
  return useAppForm({
    defaultValues,
    validators: {
      onChange: workoutSchema,
    },
    onSubmit: ({ value, formApi }) => {
      options.onSubmit(value, {
        resetForm: formApi.reset,
      });
    },
  });
}
