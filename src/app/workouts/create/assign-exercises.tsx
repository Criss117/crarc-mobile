import { ExercisesFiltersProvider } from "@/core/exercises/presentation/components/exercises-filters/provider";
import { useCreateWorkoutForm } from "@/core/workouts/presentation/components/workout-form/providers";
import { AssingExercisesScreen } from "@/core/workouts/presentation/screens/assign-exercise.screen";

export default function AssignExercises() {
  const { form } = useCreateWorkoutForm();

  return (
    <ExercisesFiltersProvider>
      <form.AppField name="exercises">
        {(field) => (
          <AssingExercisesScreen
            handleSelectExercise={(exercise) =>
              field.setValue((prev) => {
                if (prev.some((e) => e.id === exercise.id))
                  return prev.filter((e) => e.id !== exercise.id);

                return [...prev, exercise];
              })
            }
            selectedExercises={field.state.value.map((e) => e.id)}
          />
        )}
      </form.AppField>
    </ExercisesFiltersProvider>
  );
}
