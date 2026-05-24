import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import {
  Button,
  Card,
  cn,
  Input,
  Label,
  PressableFeedback,
  Text,
  TextArea,
  TextField,
} from "heroui-native";
import { BottomSheet } from "heroui-native/bottom-sheet";
import { View } from "react-native";
import { z } from "zod";

import {
  ExerciseSummary,
  useFindExercises,
} from "@/core/exercises/application/queries/use-find-exercises";
import {
  ExercisesFiltersProvider,
  useExercisesFilters,
} from "@/core/exercises/presentation/components/exercises-filters/provider";
import { ExercisesSearchBar } from "@/core/exercises/presentation/components/exercises-filters/search-bar";
import { FieldError } from "@/core/shared/components/field-errors";
import { MaterialIcons } from "@/core/shared/components/icons";
import { useState } from "react";

interface UseWorkoutFormOptions {
  onSubmit: (data: WorkoutFormData, options: { resetForm: () => void }) => void;
  defaultValues?: z.infer<typeof workoutSchema> & {
    workoutId: string;
  };
}

interface AddExercisesListProps {
  handleSelectExercise: (exercise: ExerciseSummary) => void;
  isSelected: (exercise: ExerciseSummary) => boolean;
}

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
  exercises: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        muscles: z.string(),
      }),
    )
    .min(1, {
      error: "Debes seleccionar al menos un ejercicio",
    }),
});

export type WorkoutFormData = z.infer<typeof workoutSchema>;

const defaultValues: WorkoutFormData = {
  name: "",
  description: "",
  exercises: [],
};

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

function NameField() {
  const field = useFieldContext<string>();
  const id = "workout-name";
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <TextField data-invalid={isInvalid}>
      <Label>Nombre del Workout</Label>
      <Input
        id={id}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChangeText={(v) => field.handleChange(v)}
        aria-invalid={isInvalid}
        placeholder="Upper Body Power"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </TextField>
  );
}

function DescriptionField() {
  const field = useFieldContext<string>();
  const id = "workout-description";
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <TextField data-invalid={isInvalid}>
      <Label>Descripcion (Opcional)</Label>
      <TextArea
        id={id}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChangeText={(v) => field.handleChange(v)}
        aria-invalid={isInvalid}
        placeholder="Notas para esta rutina..."
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </TextField>
  );
}

function AddExercisesList({
  handleSelectExercise,
  isSelected,
}: AddExercisesListProps) {
  const { filters } = useExercisesFilters();
  const { data: exercises } = useFindExercises({
    muscleTypeId: filters.muscleTypeId,
    searchQuery: filters.query,
  });

  return (
    <View className="gap-y-4">
      {exercises.map((exercise) => (
        <PressableFeedback
          key={exercise.id}
          onPress={() => handleSelectExercise(exercise)}
        >
          <Card
            className={cn(
              "border shadow-none border-muted",
              isSelected(exercise) && "border-success",
            )}
          >
            <Card.Body>
              <Card.Title>{exercise.name}</Card.Title>
              <Card.Description>
                {exercise.muscles.map((m) => m.name).join(", ")}
              </Card.Description>
            </Card.Body>
          </Card>
        </PressableFeedback>
      ))}
    </View>
  );
}

function AddExercisesField() {
  const [isOpen, setIsOpen] = useState(false);
  const field = useFieldContext<WorkoutFormData["exercises"]>();

  const handleSelectExercise = (exercise: ExerciseSummary) => {
    field.setValue((prev) => {
      if (prev.some((e) => e.id === exercise.id))
        return prev.filter((e) => e.id !== exercise.id);

      return [
        ...prev,
        {
          id: exercise.id,
          name: exercise.name,
          muscles: exercise.muscles.map((m) => m.name).join(", "),
        },
      ];
    });
  };

  const isSelected = (exercise: ExerciseSummary) =>
    field.state.value.some((e) => e.id === exercise.id);

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <BottomSheet.Trigger asChild>
        <Button>Añadir ejercicios</Button>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["80%"]}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full bg-background"
        >
          <ExercisesFiltersProvider>
            <View className="gap-y-2 pb-2">
              <View className="flex flex-row items-center justify-between">
                <BottomSheet.Title>Añadir ejercicios</BottomSheet.Title>
                <BottomSheet.Close />
              </View>
              <ExercisesSearchBar />
            </View>

            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-y-5"
            >
              <AddExercisesList
                handleSelectExercise={handleSelectExercise}
                isSelected={isSelected}
              />
            </BottomSheetScrollView>
          </ExercisesFiltersProvider>
          <View className="pt-2">
            <Button onPress={() => setIsOpen(false)}>Cerrar</Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

function ExercisesListField() {
  const field = useFieldContext<WorkoutFormData["exercises"]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const removeExercise = (exerciseId: string) => {
    field.setValue((prev) => prev.filter((e) => e.id !== exerciseId));
  };

  return (
    <View className="gap-y-4">
      {field.state.value.length === 0 && (
        <View className="items-center">
          <Text className="text-muted">No hay ejercicios seleccionados</Text>
        </View>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {field.state.value.map((exercise) => (
        <PressableFeedback key={exercise.id}>
          <Card className="bg-background shadow-none">
            <Card.Header className="flex-row justify-between items-center">
              <Card.Title className="flex-1">{exercise.name}</Card.Title>
              <Button
                onPress={() => removeExercise(exercise.id)}
                isIconOnly
                size="md"
                variant="ghost"
              >
                <MaterialIcons name="close" size={20} />
              </Button>
            </Card.Header>
            <Card.Body>
              <Card.Description>{exercise.muscles}</Card.Description>
            </Card.Body>
          </Card>
        </PressableFeedback>
      ))}
    </View>
  );
}

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NameField,
    DescriptionField,
    AddExercisesField,
    ExercisesListField,
  },
  formComponents: {},
});

export function useWorkoutForm(options: UseWorkoutFormOptions) {
  return useAppForm({
    defaultValues: options?.defaultValues ?? defaultValues,
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
