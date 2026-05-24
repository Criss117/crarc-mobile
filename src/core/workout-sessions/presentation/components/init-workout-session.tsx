import { Button } from "heroui-native/button";

import { useAppConfig } from "@/core/profile/application/hooks/use-app-config";
import { MaterialIcons } from "@/core/shared/components/icons";
import { useMutateWorkoutSessions } from "@/core/workout-sessions/application/hooks/use-mutate-workout-sessions";

interface Props {
  workoutId: string;
}

export function InitWorkoutSession({ workoutId }: Props) {
  const { init } = useMutateWorkoutSessions();
  const { appConfig } = useAppConfig();

  const activeWorkoutSessionId = appConfig.data?.activeWorkoutSessionId;

  const handlePress = () => {
    init.mutate({ workoutId });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      isDisabled={init.isPending || !!activeWorkoutSessionId}
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
