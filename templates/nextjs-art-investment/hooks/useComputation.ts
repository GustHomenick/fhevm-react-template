import { useState, useCallback } from 'react';

type ComputationOperation = 'add' | 'sub' | 'mul' | 'div' | 'and' | 'or' | 'xor' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';

/**
 * FHE Computation Hook
 * Handles homomorphic computations on encrypted data
 */
export function useComputation(client: any, contractAddress?: string) {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(
    async (operation: ComputationOperation, operands: string[]) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      if (!contractAddress) {
        throw new Error('Contract address required');
      }

      setIsComputing(true);
      setError(null);

      try {
        // Call API endpoint for computation
        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operation,
            operands,
            contractAddress,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Computation failed');
        setError(error);
        throw error;
      } finally {
        setIsComputing(false);
      }
    },
    [client, contractAddress]
  );

  return {
    compute,
    isComputing,
    error,
  };
}
