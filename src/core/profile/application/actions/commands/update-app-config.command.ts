import { dbConnection } from "@/integrations/db";
import { appConfig } from "@/integrations/db/schemas/app-state.schema";

type UpdateAppConfigCommand = {
  theme?: "light" | "dark";
  defaultWeightUnit?: "kg" | "lb";
  activeWorkoutSessionId?: string | null;
};

export async function updateAppConfigCommand(cmd: UpdateAppConfigCommand) {
  const { theme, defaultWeightUnit, activeWorkoutSessionId } = cmd;

  if (!theme && !defaultWeightUnit && !activeWorkoutSessionId)
    throw new Error("No data to update");

  await dbConnection.update(appConfig).set(cmd);
}
