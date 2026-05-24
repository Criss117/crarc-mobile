import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "heroui-native/button";

import { useInitWorkoutSession } from "@/core/workout-sessions/application/mutations/use-init-workout-session";

interface Props {
  workoutId: string;
}

export function InitWorkoutSession({ workoutId }: Props) {
  const initWorkoutSession = useInitWorkoutSession();

  const handlePress = () => {
    initWorkoutSession.mutate({ workoutId });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      isDisabled={initWorkoutSession.isPending}
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
