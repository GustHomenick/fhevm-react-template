/**
 * Core types for FHEVM SDK
 */

import { ethers } from 'ethers';

/**
 * FHEVM Configuration
 */
export interface FHEVMConfig {
  /** Network chain ID */
  chainId: number;
  /** Contract addresses */
  contractAddresses?: {
    ACL?: string;
    TFHEExecutor?: string;
    KMSVerifier?: string;
  };
  /** Provider URL or instance */
  provider: string | ethers.Provider;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Encrypted input for contract calls
 */
export interface EncryptedInput {
  /** Encrypted value */
  data: Uint8Array;
  /** Input proof */
  inputProof: string;
  /** Handles for the encrypted data */
  handles: string[];
}

/**
 * Decryption result
 */
export interface DecryptionResult<T = any> {
  /** Decrypted value */
  value: T;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Contract instance wrapper
 */
export interface ContractInstance {
  /** Contract address */
  address: string;
  /** Contract ABI */
  abi: any[];
  /** Ethers contract instance */
  contract: ethers.Contract;
}

/**
 * Provider type
 */
export type Provider = ethers.Provider | ethers.Signer;

/**
 * Encryption options
 */
export interface EncryptionOptions {
  /** User address */
  userAddress: string;
  /** Contract address */
  contractAddress: string;
}

/**
 * Decryption options
 */
export interface DecryptionOptions {
  /** EIP-712 signature for user decrypt */
  signature?: string;
  /** Use public decrypt instead */
  usePublicDecrypt?: boolean;
}

/**
 * Hook configuration
 */
export interface HookConfig {
  /** Enable auto-refresh */
  autoRefresh?: boolean;
  /** Refresh interval in ms */
  refreshInterval?: number;
  /** Enable caching */
  cache?: boolean;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /** Gas limit */
  gasLimit?: number;
  /** Gas price */
  gasPrice?: bigint;
  /** Max fee per gas */
  maxFeePerGas?: bigint;
  /** Max priority fee per gas */
  maxPriorityFeePerGas?: bigint;
  /** Value to send */
  value?: bigint;
}
