/**
 * API Type Definitions
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionRequest {
  value: number | string | boolean;
  contractAddress: string;
  userAddress: string;
  type?: string;
}

export interface DecryptionRequest {
  handle: string;
  contractAddress: string;
  signature?: string;
  publicDecrypt?: boolean;
}

export interface ComputationRequest {
  operation: string;
  operands: string[];
  contractAddress: string;
}

export interface KeyRequest {
  contractAddress: string;
  action?: 'generate' | 'refresh' | 'revoke';
}

export interface EncryptionResponse {
  encryptedValue: string;
  contractAddress: string;
  userAddress: string;
  timestamp: number;
}

export interface DecryptionResponse {
  value: any;
  handle: string;
  contractAddress: string;
  decryptionType: 'user' | 'public';
  timestamp: number;
}

export interface ComputationResponse {
  operation: string;
  resultHandle: string;
  contractAddress: string;
  operands: string[];
  timestamp: number;
}

export interface KeyResponse {
  publicKey: string;
  contractAddress: string;
  chainId: number;
  timestamp: number;
  keyType: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}
