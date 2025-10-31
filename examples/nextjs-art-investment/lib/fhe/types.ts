/**
 * TypeScript Type Definitions for FHE Operations
 */

export type EncryptedValue = string;
export type DecryptedValue = number | string | boolean;
export type Handle = string;

export interface EncryptionOptions {
  contractAddress: string;
  userAddress: string;
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
}

export interface DecryptionOptions {
  contractAddress: string;
  handle: Handle;
  signature?: string;
  publicDecrypt?: boolean;
}

export interface EncryptionResult {
  encryptedValue: EncryptedValue;
  handle?: Handle;
  contractAddress: string;
  userAddress: string;
  timestamp: number;
}

export interface DecryptionResult {
  value: DecryptedValue;
  handle: Handle;
  contractAddress: string;
  timestamp: number;
  decryptionType: 'user' | 'public';
}

export interface ComputationResult {
  operation: string;
  resultHandle: Handle;
  contractAddress: string;
  operands: Handle[];
  timestamp: number;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}
