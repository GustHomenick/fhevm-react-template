'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createFHEClient, FHEClient } from '@/lib/fhe/client';

interface FHEContextValue {
  client: FHEClient | null;
  isReady: boolean;
  error: Error | null;
}

const FHEContext = createContext<FHEContextValue>({
  client: null,
  isReady: false,
  error: null,
});

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}

interface FHEProviderProps {
  children: ReactNode;
  config?: {
    chainId?: number;
    provider?: string;
  };
}

export function FHEProvider({ children, config }: FHEProviderProps) {
  const [client, setClient] = useState<FHEClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeFHE() {
      try {
        const fheClient = await createFHEClient({
          chainId: config?.chainId || 8009,
          provider: config?.provider || 'https://devnet.zama.ai',
        });

        setClient(fheClient);
        setIsReady(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize FHE client');
        setError(error);
        console.error('FHE initialization error:', error);
      }
    }

    initializeFHE();
  }, [config]);

  return (
    <FHEContext.Provider value={{ client, isReady, error }}>
      {children}
    </FHEContext.Provider>
  );
}
