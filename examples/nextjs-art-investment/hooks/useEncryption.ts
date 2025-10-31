import { useState, useCallback } from 'react';

/**
 * Encryption Hook
 * Handles encryption operations with FHEVM SDK
 */
export function useEncryption(client: any, contractAddress?: string, userAddress?: string) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | string | boolean) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      if (!contractAddress || !userAddress) {
        throw new Error('Contract address and user address required');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        // Call API endpoint for encryption
        const response = await fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value,
            contractAddress,
            userAddress,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, contractAddress, userAddress]
  );

  return {
    encrypt,
    isEncrypting,
    error,
  };
}
