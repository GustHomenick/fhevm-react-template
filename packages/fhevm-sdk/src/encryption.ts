/**
 * Encryption utilities for FHEVM
 */

import type { FHEVMClient } from './core';
import type { EncryptedInput, EncryptionOptions } from './types';

/**
 * Encrypt a value for use in smart contract
 */
export async function encryptValue(
  client: FHEVMClient,
  value: number | bigint,
  options: EncryptionOptions
): Promise<EncryptedInput> {
  const instance = client.getInstance();

  try {
    const input = instance.createEncryptedInput(
      options.contractAddress,
      options.userAddress
    );

    // Add the value to encrypted input
    input.add64(BigInt(value));

    // Get the encrypted data and proof
    const encryptedData = input.encrypt();

    return {
      data: encryptedData.handles[0],
      inputProof: encryptedData.inputProof,
      handles: encryptedData.handles,
    };
  } catch (error) {
    console.error('[FHEVM SDK] Encryption failed:', error);
    throw error;
  }
}

/**
 * Encrypt a boolean value
 */
export async function encryptBool(
  client: FHEVMClient,
  value: boolean,
  options: EncryptionOptions
): Promise<EncryptedInput> {
  const instance = client.getInstance();

  const input = instance.createEncryptedInput(
    options.contractAddress,
    options.userAddress
  );

  input.addBool(value);
  const encryptedData = input.encrypt();

  return {
    data: encryptedData.handles[0],
    inputProof: encryptedData.inputProof,
    handles: encryptedData.handles,
  };
}

/**
 * Encrypt an array of values
 */
export async function encryptArray(
  client: FHEVMClient,
  values: (number | bigint)[],
  options: EncryptionOptions
): Promise<EncryptedInput> {
  const instance = client.getInstance();

  const input = instance.createEncryptedInput(
    options.contractAddress,
    options.userAddress
  );

  values.forEach((val) => {
    input.add64(BigInt(val));
  });

  const encryptedData = input.encrypt();

  return {
    data: encryptedData.handles[0],
    inputProof: encryptedData.inputProof,
    handles: encryptedData.handles,
  };
}

/**
 * Create encrypted input builder (fluent API)
 */
export class EncryptedInputBuilder {
  private client: FHEVMClient;
  private input: any;
  private options: EncryptionOptions;

  constructor(client: FHEVMClient, options: EncryptionOptions) {
    this.client = client;
    this.options = options;

    const instance = client.getInstance();
    this.input = instance.createEncryptedInput(
      options.contractAddress,
      options.userAddress
    );
  }

  /**
   * Add a boolean value
   */
  addBool(value: boolean): this {
    this.input.addBool(value);
    return this;
  }

  /**
   * Add a uint8 value
   */
  add8(value: number): this {
    this.input.add8(value);
    return this;
  }

  /**
   * Add a uint16 value
   */
  add16(value: number): this {
    this.input.add16(value);
    return this;
  }

  /**
   * Add a uint32 value
   */
  add32(value: number): this {
    this.input.add32(value);
    return this;
  }

  /**
   * Add a uint64 value
   */
  add64(value: number | bigint): this {
    this.input.add64(BigInt(value));
    return this;
  }

  /**
   * Add an address
   */
  addAddress(address: string): this {
    this.input.addAddress(address);
    return this;
  }

  /**
   * Build and return encrypted input
   */
  encrypt(): EncryptedInput {
    const encryptedData = this.input.encrypt();

    return {
      data: encryptedData.handles[0],
      inputProof: encryptedData.inputProof,
      handles: encryptedData.handles,
    };
  }
}

/**
 * Create encrypted input builder
 */
export function createInputBuilder(
  client: FHEVMClient,
  options: EncryptionOptions
): EncryptedInputBuilder {
  return new EncryptedInputBuilder(client, options);
}
