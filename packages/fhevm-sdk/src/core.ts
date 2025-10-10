/**
 * Core FHEVM SDK functionality
 */

import { ethers } from 'ethers';
import { initFhevm, createInstance } from 'fhevmjs';
import type { FHEVMConfig, Provider } from './types';

/**
 * FHEVM Client - Main SDK class
 */
export class FHEVMClient {
  private config: FHEVMConfig;
  private provider: ethers.Provider;
  private instance: any;
  private initialized: boolean = false;

  constructor(config: FHEVMConfig) {
    this.config = config;

    // Initialize provider
    if (typeof config.provider === 'string') {
      this.provider = new ethers.JsonRpcProvider(config.provider);
    } else {
      this.provider = config.provider as ethers.Provider;
    }
  }

  /**
   * Initialize FHEVM instance
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await initFhevm();

      this.instance = await createInstance({
        chainId: this.config.chainId,
        publicKey: await this.getPublicKey(),
        gatewayUrl: await this.getGatewayUrl(),
        aclAddress: this.config.contractAddresses?.ACL,
      });

      this.initialized = true;

      if (this.config.debug) {
        console.log('[FHEVM SDK] Initialized successfully');
      }
    } catch (error) {
      console.error('[FHEVM SDK] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get FHEVM instance
   */
  getInstance() {
    if (!this.initialized) {
      throw new Error('FHEVM not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Get provider
   */
  getProvider(): ethers.Provider {
    return this.provider;
  }

  /**
   * Get configuration
   */
  getConfig(): FHEVMConfig {
    return this.config;
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get public key from network
   */
  private async getPublicKey(): Promise<string> {
    // Implementation to fetch public key from network
    // This would typically come from a well-known contract
    return '0x...'; // Placeholder
  }

  /**
   * Get gateway URL based on chain ID
   */
  private async getGatewayUrl(): Promise<string> {
    const gatewayUrls: Record<number, string> = {
      8009: 'https://gateway.zama.ai',
      // Add other networks
    };

    return gatewayUrls[this.config.chainId] || 'https://gateway.zama.ai';
  }

  /**
   * Create a contract instance
   */
  async createContractInstance(
    address: string,
    abi: any[]
  ): Promise<ethers.Contract> {
    return new ethers.Contract(address, abi, this.provider);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.initialized = false;
    this.instance = null;
  }
}

/**
 * Create and initialize FHEVM client
 */
export async function createFHEVMClient(
  config: FHEVMConfig
): Promise<FHEVMClient> {
  const client = new FHEVMClient(config);
  await client.init();
  return client;
}

/**
 * Global singleton instance (optional pattern)
 */
let globalClient: FHEVMClient | null = null;

/**
 * Get or create global FHEVM client
 */
export async function getGlobalClient(
  config?: FHEVMConfig
): Promise<FHEVMClient> {
  if (!globalClient && config) {
    globalClient = await createFHEVMClient(config);
  }

  if (!globalClient) {
    throw new Error('FHEVM client not initialized. Provide config first.');
  }

  return globalClient;
}

/**
 * Reset global client
 */
export function resetGlobalClient(): void {
  if (globalClient) {
    globalClient.dispose();
    globalClient = null;
  }
}
