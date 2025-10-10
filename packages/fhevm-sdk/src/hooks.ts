/**
 * React hooks for FHEVM (wagmi-like API)
 * These hooks are React-specific but built on top of the framework-agnostic core
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import type { FHEVMClient } from './core';
import type { EncryptedInput, DecryptionResult, HookConfig } from './types';
import { encryptValue, createInputBuilder } from './encryption';
import { userDecrypt, publicDecrypt, smartDecrypt } from './decryption';

/**
 * Hook to use FHEVM client
 */
export function useFHEVM(client: FHEVMClient) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        if (!client.isInitialized()) {
          await client.init();
        }
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    }

    initialize();
  }, [client]);

  return { isReady, error, client };
}

/**
 * Hook to encrypt values
 */
export function useEncrypt(
  client: FHEVMClient,
  contractAddress: string,
  userAddress: string
) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | bigint): Promise<EncryptedInput | null> {
      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await encryptValue(client, value, {
          contractAddress,
          userAddress,
        });
        return encrypted;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, contractAddress, userAddress]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook to decrypt values
 */
export function useDecrypt<T = bigint>(
  client: FHEVMClient,
  contractAddress: string,
  signer?: ethers.Signer
) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (handle: string): Promise<T | null> {
      setIsDecrypting(true);
      setError(null);

      try {
        const result = await smartDecrypt<T>(
          client,
          handle,
          contractAddress,
          signer
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.value;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, contractAddress, signer]
  );

  return { decrypt, isDecrypting, error };
}

/**
 * Hook to read encrypted contract state
 */
export function useEncryptedRead<T = bigint>(
  client: FHEVMClient,
  contractAddress: string,
  handle: string | null,
  signer?: ethers.Signer,
  config?: HookConfig
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!handle) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await smartDecrypt<T>(
        client,
        handle,
        contractAddress,
        signer
      );

      if (result.success) {
        setData(result.value);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [client, contractAddress, handle, signer]);

  useEffect(() => {
    fetchData();

    // Setup auto-refresh if enabled
    if (config?.autoRefresh && config.refreshInterval) {
      intervalRef.current = setInterval(fetchData, config.refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, config]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook to write encrypted data to contract
 */
export function useEncryptedWrite(
  client: FHEVMClient,
  contract: ethers.Contract,
  functionName: string,
  userAddress: string
) {
  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const write = useCallback(
    async (
      value: number | bigint,
      ...additionalArgs: any[]
    ): Promise<ethers.TransactionResponse | null> {
      setIsWriting(true);
      setError(null);
      setTxHash(null);

      try {
        const encrypted = await encryptValue(client, value, {
          contractAddress: await contract.getAddress(),
          userAddress,
        });

        const tx = await contract[functionName](
          encrypted.data,
          encrypted.inputProof,
          ...additionalArgs
        );

        setTxHash(tx.hash);
        await tx.wait();

        return tx;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsWriting(false);
      }
    },
    [client, contract, functionName, userAddress]
  );

  return { write, isWriting, error, txHash };
}

/**
 * Hook to manage encrypted input builder
 */
export function useEncryptedInput(
  client: FHEVMClient,
  contractAddress: string,
  userAddress: string
) {
  const [builder, setBuilder] = useState<any>(null);

  useEffect(() => {
    const inputBuilder = createInputBuilder(client, {
      contractAddress,
      userAddress,
    });
    setBuilder(inputBuilder);
  }, [client, contractAddress, userAddress]);

  return builder;
}

/**
 * Hook to watch encrypted events
 */
export function useEncryptedEvent<T = any>(
  contract: ethers.Contract,
  eventName: string,
  client: FHEVMClient,
  signer?: ethers.Signer
) {
  const [events, setEvents] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function setupListener() {
      setIsLoading(true);

      const filter = contract.filters[eventName]();
      const pastEvents = await contract.queryFilter(filter);

      // Decrypt encrypted event data
      const decryptedEvents = await Promise.all(
        pastEvents.map(async (event) => {
          // Assuming event has encrypted handle
          const handle = event.args?.[0]; // Adjust based on your event structure

          if (handle && signer) {
            const result = await smartDecrypt(
              client,
              handle,
              await contract.getAddress(),
              signer
            );
            return result.value;
          }

          return event.args;
        })
      );

      setEvents(decryptedEvents as T[]);
      setIsLoading(false);

      // Listen for new events
      contract.on(eventName, async (...args) => {
        const handle = args[0];

        if (handle && signer) {
          const result = await smartDecrypt(
            client,
            handle,
            await contract.getAddress(),
            signer
          );

          setEvents((prev) => [...prev, result.value as T]);
        }
      });
    }

    setupListener();

    return () => {
      contract.removeAllListeners(eventName);
    };
  }, [contract, eventName, client, signer]);

  return { events, isLoading };
}
