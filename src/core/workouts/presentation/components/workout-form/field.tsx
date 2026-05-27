import { createFormHookContexts } from "@tanstack/react-form";
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
import { useMemo } from "react";
import { View } from "react-native";

import { useFindExercises } from "@/core/exercises/application/hooks/use-find-exercises";
import type { ExerciseSummary } from "@/core/exercises/domain/execises.entity";
import { useExercisesFilters } from "@/core/exercises/presentation/components/exercises-filters/provider";
import { FieldError } from "@/core/shared/components/field-errors";
import { MaterialIcons } from "@/core/shared/components/icons";

interface AddExercisesListProps {
  handleSelectExercise: (exercise: ExerciseSummary) => void;
  isSelected: (exercise: ExerciseSummary) => boolean;
}

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export function NameField() {
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

export function DescriptionField() {
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

export function AddExercisesList({
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

export function ExercisesListField() {
  const { data: exercises } = useFindExercises();
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const removeExercise = (exerciseId: string) => {
    field.setValue((prev) => prev.filter((id) => id !== exerciseId));
  };

  const selectedExercises = useMemo(
    () =>
      field.state.value
        .map((exerciseId) => exercises.find((e) => exerciseId === e.id))
        .filter((e) => e !== undefined),
    [field.state.value, exercises],
  );

  return (
    <View className="gap-y-4">
      {field.state.value.length === 0 && (
        <View className="items-center">
          <Text className="text-muted">No hay ejercicios seleccionados</Text>
        </View>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {selectedExercises.map((exercise) => (
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
                <MaterialIcons
                  name="close"
                  size={20}
                  className="dark:text-white"
                />
              </Button>
            </Card.Header>
            <Card.Body>
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
