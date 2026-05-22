import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import { View } from "react-native";

import { Text } from "@/core/shared/components/text";
import migrations from "../../../drizzle/migrations";

const expo = SQLite.openDatabaseSync("db.db");

export const dbConnection = drizzle(expo);

export function DBProvider({ children }: { children: React.ReactNode }) {
  const { success, error } = useMigrations(dbConnection, migrations);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
