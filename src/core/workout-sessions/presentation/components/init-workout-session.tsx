import { Button } from "heroui-native/button";

import { useMutateWorkoutSessions } from "@/core/workout-sessions/application/hooks/use-mutate-workout-sessions";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  workoutId: string;
}

export function InitWorkoutSession({ workoutId }: Props) {
  const { init } = useMutateWorkoutSessions();

  const handlePress = () => {
    init.mutate({ workoutId });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      isDisabled={init.isPending}
      onPress={handlePress}
    >
      <Button.Label>Iniciar</Button.Label>
      <MaterialIcons
        name="play-circle-outline"
        size={20}
        className="dark:text-white"
      />
    </Button>
  );
}

export function InitWorkoutSessionSkeleton() {
  return (
    <Button
      variant="outline"
      size="sm"
      isDisabled
      accessibilityRole="none"
      accessibilityLabel="Cargando contenido"
    >
      <Button.Label>Iniciar</Button.Label>
      <MaterialIcons
        name="play-circle-outline"
        size={20}
        className="dark:text-white"
      />
    </Button>
  );
}
