import { KeyboardProvider } from "react-native-keyboard-controller";

import { DBProvider } from "./db/provider";
import { FontsProvider } from "./fonts";
import { HeroUIProvider } from "./hero-ui";
import { QueryProvider } from "./query";

interface Props {
  children: React.ReactNode;
}

export function Integrations({ children }: Props) {
  return (
    <DBProvider>
      <QueryProvider>
        <FontsProvider>
          <HeroUIProvider>
            <KeyboardProvider>{children}</KeyboardProvider>
          </HeroUIProvider>
        </FontsProvider>
      </QueryProvider>
    </DBProvider>
  );
}
