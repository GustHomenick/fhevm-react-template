/**
 * Decryption utilities for FHEVM
 */

import { ethers } from 'ethers';
import type { FHEVMClient } from './core';
import type { DecryptionResult, DecryptionOptions } from './types';

/**
 * Decrypt a value using user decrypt (EIP-712 signature)
 */
export async function userDecrypt<T = bigint>(
  client: FHEVMClient,
  handle: string,
  signer: ethers.Signer,
  contractAddress: string
): Promise<DecryptionResult<T>> {
  try {
    const instance = client.getInstance();

    // Create EIP-712 signature
    const signature = await createDecryptSignature(
      signer,
      handle,
      contractAddress
    );

    // Request decryption
    const decryptedValue = await instance.decrypt(
      contractAddress,
      handle,
      signature
    );

    return {
      value: decryptedValue as T,
      success: true,
    };
  } catch (error: any) {
    return {
      value: null as T,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Decrypt using public decrypt (no signature required)
 */
export async function publicDecrypt<T = bigint>(
  client: FHEVMClient,
  handle: string,
  contractAddress: string
): Promise<DecryptionResult<T>> {
  try {
    const instance = client.getInstance();

    const decryptedValue = await instance.publicDecrypt(
      contractAddress,
      handle
    );

    return {
      value: decryptedValue as T,
      success: true,
    };
  } catch (error: any) {
    return {
      value: null as T,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create EIP-712 signature for decryption
 */
async function createDecryptSignature(
  signer: ethers.Signer,
  handle: string,
  contractAddress: string
): Promise<string> {
  const domain = {
    name: 'FHEVM Decryption',
    version: '1',
    chainId: await signer.provider!.getNetwork().then((n) => n.chainId),
    verifyingContract: contractAddress,
  };

  const types = {
    Decryption: [
      { name: 'handle', type: 'bytes32' },
      { name: 'timestamp', type: 'uint256' },
    ],
  };

  const value = {
    handle: handle,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return await signer.signTypedData(domain, types, value);
}

/**
 * Batch decrypt multiple handles
 */
export async function batchUserDecrypt<T = bigint>(
  client: FHEVMClient,
  handles: string[],
  signer: ethers.Signer,
  contractAddress: string
): Promise<DecryptionResult<T[]>> {
  try {
    const results = await Promise.all(
      handles.map((handle) =>
        userDecrypt<T>(client, handle, signer, contractAddress)
      )
    );

    const values = results.map((r) => r.value);
    const allSuccess = results.every((r) => r.success);

    if (!allSuccess) {
      const errors = results
        .filter((r) => !r.success)
        .map((r) => r.error)
        .join('; ');

      return {
        value: values as T[],
        success: false,
        error: `Some decryptions failed: ${errors}`,
      };
    }

    return {
      value: values as T[],
      success: true,
    };
  } catch (error: any) {
    return {
      value: [] as T[],
      success: false,
      error: error.message,
    };
  }
}

/**
 * Decrypt with automatic fallback to public decrypt
 */
export async function smartDecrypt<T = bigint>(
  client: FHEVMClient,
  handle: string,
  contractAddress: string,
  signer?: ethers.Signer,
  options?: DecryptionOptions
): Promise<DecryptionResult<T>> {
  // Try user decrypt first if signer is provided
  if (signer && !options?.usePublicDecrypt) {
    const result = await userDecrypt<T>(
      client,
      handle,
      signer,
      contractAddress
    );

    if (result.success) {
      return result;
    }

    console.warn('[FHEVM SDK] User decrypt failed, falling back to public decrypt');
  }

  // Fallback to public decrypt
  return await publicDecrypt<T>(client, handle, contractAddress);
}

/**
 * Decryption manager for handling multiple decryption requests
 */
export class DecryptionManager {
  private client: FHEVMClient;
  private contractAddress: string;
  private signer?: ethers.Signer;

  constructor(
    client: FHEVMClient,
    contractAddress: string,
    signer?: ethers.Signer
  ) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.signer = signer;
  }

  /**
   * Decrypt a single value
   */
  async decrypt<T = bigint>(handle: string): Promise<DecryptionResult<T>> {
    return smartDecrypt<T>(
      this.client,
      handle,
      this.contractAddress,
      this.signer
    );
  }

  /**
   * Decrypt multiple values
   */
  async decryptBatch<T = bigint>(
    handles: string[]
  ): Promise<DecryptionResult<T[]>> {
    if (this.signer) {
      return batchUserDecrypt<T>(
        this.client,
        handles,
        this.signer,
        this.contractAddress
      );
    }

    // Use public decrypt for batch
    const results = await Promise.all(
      handles.map((handle) =>
        publicDecrypt<T>(this.client, handle, this.contractAddress)
      )
    );

    const values = results.map((r) => r.value);
    const allSuccess = results.every((r) => r.success);

    return {
      value: values as T[],
      success: allSuccess,
      error: allSuccess ? undefined : 'Some decryptions failed',
    };
  }

  /**
   * Set signer for user decrypt
   */
  setSigner(signer: ethers.Signer): void {
    this.signer = signer;
  }
}

/**
 * Create decryption manager
 */
export function createDecryptionManager(
  client: FHEVMClient,
  contractAddress: string,
  signer?: ethers.Signer
): DecryptionManager {
  return new DecryptionManager(client, contractAddress, signer);
}
