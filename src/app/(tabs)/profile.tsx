import { Text } from "heroui-native/text";

import { useAppConfig } from "@/core/profile/application/hooks/use-app-config";

export default function Profile() {
  const { appConfig } = useAppConfig();

  return <Text>{JSON.stringify(appConfig.data, null, 2)}</Text>;
}
