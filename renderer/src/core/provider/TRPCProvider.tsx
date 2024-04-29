import React, { useMemo, useState } from 'react';
import { api } from '../../utils/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';

interface TrpcProviderProps {
  children: React.ReactNode;
}

const TrpcProvider: React.FC<TrpcProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = useMemo(() => {
    return api.createClient({
      links: [
        loggerLink({
          enabled: (opts) => {
            return (
              process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error)
            );
          },
        }),
        httpBatchLink({
          url: `http://127.0.0.1:9988/api/trpc`,
          async headers() {
            let headers: any = {};

            return headers;
          },
        }),
      ],
    });
  }, []);

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};

export default TrpcProvider;
