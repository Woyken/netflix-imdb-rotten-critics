import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { type Component } from "solid-js";
import { CardsRenderer } from "./CardsRenderer";
import { persistQueryClient } from "@tanstack/solid-query-persist-client";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const App: Component = () => {
  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity } },
  });

  persistQueryClient({ persister: localStoragePersister, queryClient });

  return (
    <QueryClientProvider client={queryClient}>
      <CardsRenderer />
      <div></div>
    </QueryClientProvider>
  );
};

export default App;
