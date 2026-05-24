import { dbConnection } from "@/integrations/db";
import { appConfig } from "@/integrations/db/schemas/app-state.schema";

export async function findAppConfigQuery() {
  const [data] = await dbConnection.select().from(appConfig);

  return data;
}
