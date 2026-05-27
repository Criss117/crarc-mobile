import { ExercisesFiltersProvider } from "@/core/exercises/presentation/components/exercises-filters/provider";
import { useCreateWorkoutForm } from "@/core/workouts/presentation/components/workout-form/providers";
import { AssingExercisesScreen } from "@/core/workouts/presentation/screens/assign-exercise.screen";

export default function AssignExercises() {
  const { form } = useCreateWorkoutForm();

  return (
    <ExercisesFiltersProvider>
      <form.AppField name="exerciseIds">
        {(field) => (
          <AssingExercisesScreen
            handleSelectExercise={(exerciseId) =>
              field.setValue((prev) =>
                Array.from(new Set([...prev, exerciseId])),
              )
            }
            selectedExercises={field.state.value}
          />
        )}
      </form.AppField>
    </ExercisesFiltersProvider>
  );
}
