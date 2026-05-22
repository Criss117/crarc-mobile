import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Datos se consideran frescos por 5 minutos
      staleTime: 1000 * 60 * 5,

      // Cache se mantiene 24 horas (incluso queries inactivos)
      gcTime: 1000 * 60 * 60 * 24,

      // No reintentar en background cuando la app vuelve al foco
      refetchOnWindowFocus: false,

      // No refetch al reconectar (lo manejamos manualmente)
      refetchOnReconnect: "always",

      // 3 reintentos con backoff exponencial
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),

      // Mostrar datos cacheados mientras se refetch en background
      placeholderData: (prev: unknown) => prev,

      // Nunca fallar silenciosamente si hay datos en cache
      networkMode: "offlineFirst",
    },
    mutations: {
      // Reintentar mutaciones al reconectar (crítico para offline)
      networkMode: "offlineFirst",
      retry: 2,
    },
  },
});

async function onCopy(text: string) {
  return true;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <DevToolsBubble onCopy={onCopy} queryClient={queryClient} />
    </QueryClientProvider>
  );
}
