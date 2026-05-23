import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { View } from "react-native";
import migrations from "../../../drizzle/migrations";

import { Text } from "@/core/shared/components/text";
import { useEffect, useState } from "react";
import { dbConnection } from ".";
import { seedExercises } from "./seed";

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [isPending, setIsPending] = useState(true);
  const { success, error } = useMigrations(dbConnection, migrations);

  useEffect(() => {
    if (!success) return;

    setIsPending(true);
    seedExercises(dbConnection).finally(() => setIsPending(false));
  }, [success]);

  if (error)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Migration error: {error.message}</Text>
      </View>
    );

  if (!success)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Migration is in progress...</Text>
      </View>
    );

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Poblando datos...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
