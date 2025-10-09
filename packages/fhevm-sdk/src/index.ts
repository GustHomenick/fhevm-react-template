/**
 * Universal FHEVM SDK
 * Framework-agnostic SDK for building confidential dApps with Fully Homomorphic Encryption
 *
 * @module @fhevm/sdk
 */

export * from './core';
export * from './encryption';
export * from './decryption';
export * from './hooks';
export * from './adapters';
export * from './utils';
export * from './types';

// Re-export commonly used types
export type {
  FHEVMConfig,
  EncryptedInput,
  DecryptionResult,
  ContractInstance,
  Provider
} from './types';

// Version export
export const VERSION = '1.0.0';
