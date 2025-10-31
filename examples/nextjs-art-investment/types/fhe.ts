/**
 * FHE-specific Type Definitions
 */

export type EncryptedType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';

export interface FHEVMInstance {
  encrypt8(value: number): Promise<string>;
  encrypt16(value: number): Promise<string>;
  encrypt32(value: number): Promise<string>;
  encrypt64(value: bigint): Promise<string>;
  encryptBool(value: boolean): Promise<string>;
  encryptAddress(value: string): Promise<string>;
}

export interface FHEVMConfig {
  chainId: number;
  provider: string;
  contractAddresses?: {
    ACL?: string;
    TFHEExecutor?: string;
    KMSVerifier?: string;
  };
  publicKey?: string;
  debug?: boolean;
}

export interface EncryptedInput {
  data: Uint8Array;
  handles: string[];
  inputProof: string;
}

export interface DecryptionRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
  signature?: string;
}

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface EIP712Message {
  handle: string;
  contractAddress: string;
  userAddress: string;
}

export interface EncryptedState {
  value: string;
  type: EncryptedType;
  timestamp: number;
  blockNumber: number;
}
