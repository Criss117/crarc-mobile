// db/schema/shared.ts
import { integer, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

export function uuid(name = "id") {
  return text(name)
    .primaryKey()
    .$defaultFn(() => v7());
}

export const auditMetadata = {
  createdAt: integer("created_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .$defaultFn(() => new Date()),

  deletedAt: integer("deleted_at", {
    mode: "timestamp_ms",
  }),
};

export const weightUnits = ["kg", "lb"] as const;

export type WeightUnit = (typeof weightUnits)[number];
