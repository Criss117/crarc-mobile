import { useMutateWorkouts } from "@/core/workouts/application/hooks/use-mutate-workouts";
import { useRouter } from "expo-router";
import { createContext, use, useCallback, useRef } from "react";
import { useWorkoutForm, WorkoutFormData } from ".";

const CreateWorkoutFormContext = createContext<{
  form: ReturnType<typeof useWorkoutForm>;
  isPending: boolean;
} | null>(null);

export function useCreateWorkoutForm() {
  const c = use(CreateWorkoutFormContext);

  if (!c)
    throw new Error(
      "CreateWorkoutFormContext must be used within a CreateWorkoutFormProvider",
    );
  return c;
}

export function CreateWorkoutFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { create } = useMutateWorkouts();
  const router = useRouter();

  const form = useWorkoutForm({
    onSubmit: (data, options) => {
      create.mutate(
        {
          name: data.name,
          description: data.description,
          exercises: data.exerciseIds.map((e, index) => ({
            exerciseId: e,
            orderIndex: index,
          })),
        },
        {
          onSuccess: () => {
            options.resetForm();
            router.replace({
              pathname: "/workouts",
            });
          },
        },
      );
    },
  });

  return (
    <CreateWorkoutFormContext.Provider
      value={{ form, isPending: create.isPending }}
    >
      {children}
    </CreateWorkoutFormContext.Provider>
  );
}

const UpdateWorkoutFormContext = createContext<{
  form: ReturnType<typeof useWorkoutForm>;
  isPending: boolean;
  setDefaultValues: (values: WorkoutFormData & { workoutId: string }) => void;
} | null>(null);

export function useUpdateWorkoutForm() {
  const c = use(UpdateWorkoutFormContext);

  if (!c)
    throw new Error(
      "UpdateWorkoutFormContext must be used within a UpdateWorkoutFormProvider",
    );

  return c;
}

export function UpdateWorkoutFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { update } = useMutateWorkouts();
  const workoutIdRef = useRef<string>(null);

  const form = useWorkoutForm({
    onSubmit: (data, options) => {
      if (!workoutIdRef.current) throw new Error("WorkoutId is required");

      update.mutate(
        {
          id: workoutIdRef.current,
          name: data.name,
          description: data.description,
          exercises: data.exerciseIds.map((e, index) => ({
            exerciseId: e,
            orderIndex: index,
          })),
        },
        {
          onSuccess: () => {
            options.resetForm();
            router.replace({
              pathname: "/workouts",
            });
          },
          onError: (e) => {
            console.log(e);
          },
        },
      );
    },
  });

  const setDefaultValues = useCallback(
    (values: WorkoutFormData & { workoutId: string }) => {
      workoutIdRef.current = values.workoutId;
      form.setFieldValue("name", values.name);
      form.setFieldValue("description", values.description);
      form.setFieldValue("exerciseIds", values.exerciseIds);
    },
    [form],
  );

  return (
    <UpdateWorkoutFormContext.Provider
      value={{ form, setDefaultValues, isPending: update.isPending }}
    >
      {children}
    </UpdateWorkoutFormContext.Provider>
  );
}
