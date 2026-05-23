import { getTableColumns, SQL, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import * as SQLite from "expo-sqlite";
import * as schemas from "./schemas";

const expo = SQLite.openDatabaseSync("db.db");

export const dbConnection = drizzle(expo, {
  schema: schemas,
});

export type DBConnection = typeof dbConnection;

export const buildConflictUpdateColumns = <
  T extends SQLiteTable,
  Q extends keyof T["_"]["columns"],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);

  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);

      return acc;
    },
    {} as Record<Q, SQL>,
  );
};
