import { useState, useEffect } from 'react';

/**
 * Main FHEVM Hook
 * Provides access to FHEVM client and initialization status
 */
export function useFHE(client: any) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (client) {
      setIsReady(true);
      setError(null);
    } else {
      setIsReady(false);
    }
  }, [client]);

  return {
    client,
    isReady,
    error,
    getInstance: () => client?.getInstance(),
  };
}
