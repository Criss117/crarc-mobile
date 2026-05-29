import { createFormHookContexts } from "@tanstack/react-form";
import { Image } from "expo-image";
import {
  Button,
  Card,
  Input,
  Label,
  PressableFeedback,
  Text,
  TextArea,
  TextField,
} from "heroui-native";
import { View } from "react-native";

import type { ExerciseSummary } from "@/core/exercises/domain/execises.entity";
import { FieldError } from "@/core/shared/components/field-errors";
import { MaterialIcons } from "@/core/shared/components/icons";
import { IMAGES } from "@/core/shared/utils/constanst";

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

const SELECTED_EXERCISES_HEIGHT = 80;

export function ExercisesListField() {
  const field = useFieldContext<
    {
      id: string;
      name: string;
      muscles: string[];
      image: string | null;
    }[]
  >();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const removeExercise = (exerciseId: string) => {
    field.setValue((prev) => prev.filter((e) => e.id !== exerciseId));
  };

  const selectedExercises = field.state.value;

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
          <Card
            className="bg-background shadow-none flex-1 flex-row p-0"
            style={{
              height: SELECTED_EXERCISES_HEIGHT,
            }}
          >
            {exercise.image && (
              <View className="h-full rounded-2xl px-4 items-center justify-center">
                <Image
                  source={{ uri: exercise.image }}
                  style={{
                    width: SELECTED_EXERCISES_HEIGHT - 10,
                    height: SELECTED_EXERCISES_HEIGHT - 10,
                  }}
                  placeholder={IMAGES.placeholder}
                  contentFit="cover"
                  className="aspect-square rounded-full"
                  transition={1000}
                />
              </View>
            )}
            <View className="flex-1 justify-between flex-row py-4">
              <Card.Header className="flex-1 justify-center">
                <Card.Title className="">{exercise.name}</Card.Title>
                <Card.Description className="line-clamp-1">
                  {exercise.muscles.join(", ")}
                </Card.Description>
              </Card.Header>
              <Card.Body>
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
              </Card.Body>
            </View>
          </Card>
        </PressableFeedback>
      ))}
    </View>
  );
}
