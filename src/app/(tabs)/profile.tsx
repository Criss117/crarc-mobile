import { useAppConfig } from "@/core/profile/application/hooks/use-app-config";
import { Text } from "@/core/shared/components/text";

export default function Profile() {
  const { appConfig } = useAppConfig();

  return <Text>{JSON.stringify(appConfig.data, null, 2)}</Text>;
}
