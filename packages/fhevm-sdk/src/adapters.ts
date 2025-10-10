/**
 * Framework adapters for FHEVM SDK
 * Provides integration patterns for different frameworks
 */

import type { FHEVMClient } from './core';
import type { FHEVMConfig } from './types';
import { createFHEVMClient } from './core';

/**
 * Vue.js Adapter
 * Provides reactive state management for Vue applications
 */
export class VueAdapter {
  private client: FHEVMClient | null = null;
  private state: any;

  constructor(config: FHEVMConfig) {
    // Create reactive state (assuming Vue 3 reactive/ref pattern)
    this.state = {
      isInitialized: false,
      isLoading: true,
      error: null,
    };

    this.initialize(config);
  }

  private async initialize(config: FHEVMConfig) {
    try {
      this.client = await createFHEVMClient(config);
      this.state.isInitialized = true;
      this.state.isLoading = false;
    } catch (error) {
      this.state.error = error;
      this.state.isLoading = false;
    }
  }

  getClient(): FHEVMClient | null {
    return this.client;
  }

  getState() {
    return this.state;
  }
}

/**
 * Next.js Adapter
 * Provides SSR-safe FHEVM integration
 */
export class NextAdapter {
  private client: FHEVMClient | null = null;
  private config: FHEVMConfig;

  constructor(config: FHEVMConfig) {
    this.config = config;
  }

  /**
   * Initialize client (client-side only)
   */
  async initializeClient(): Promise<FHEVMClient> {
    if (typeof window === 'undefined') {
      throw new Error('FHEVM client can only be initialized on client side');
    }

    if (!this.client) {
      this.client = await createFHEVMClient(this.config);
    }

    return this.client;
  }

  /**
   * Get client if initialized
   */
  getClient(): FHEVMClient | null {
    return this.client;
  }

  /**
   * Check if running on server
   */
  isServer(): boolean {
    return typeof window === 'undefined';
  }
}

/**
 * Node.js Adapter
 * Provides backend integration for Node.js applications
 */
export class NodeAdapter {
  private client: FHEVMClient;

  constructor(client: FHEVMClient) {
    this.client = client;
  }

  /**
   * Create encrypted input for contract call
   */
  async prepareEncryptedInput(
    value: number | bigint,
    contractAddress: string,
    userAddress: string
  ) {
    const { encryptValue } = await import('./encryption');

    return await encryptValue(this.client, value, {
      contractAddress,
      userAddress,
    });
  }

  /**
   * Decrypt value from contract
   */
  async decryptValue(handle: string, contractAddress: string) {
    const { publicDecrypt } = await import('./decryption');

    return await publicDecrypt(this.client, handle, contractAddress);
  }

  /**
   * Get client instance
   */
  getClient(): FHEVMClient {
    return this.client;
  }
}

/**
 * Create framework-specific adapter
 */
export function createAdapter(
  framework: 'vue' | 'next' | 'node',
  config: FHEVMConfig
): VueAdapter | NextAdapter | NodeAdapter {
  switch (framework) {
    case 'vue':
      return new VueAdapter(config);
    case 'next':
      return new NextAdapter(config);
    case 'node':
      // For Node.js, we need to create client first
      throw new Error('Use createNodeAdapter with initialized client');
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

/**
 * Create Node.js adapter with client
 */
export async function createNodeAdapter(
  config: FHEVMConfig
): Promise<NodeAdapter> {
  const client = await createFHEVMClient(config);
  return new NodeAdapter(client);
}

/**
 * Universal provider pattern
 * Works with any framework through dependency injection
 */
export class UniversalProvider {
  private client: FHEVMClient | null = null;
  private subscribers: Set<(client: FHEVMClient) => void> = new Set();

  async initialize(config: FHEVMConfig): Promise<void> {
    this.client = await createFHEVMClient(config);

    // Notify all subscribers
    this.subscribers.forEach((callback) => {
      if (this.client) {
        callback(this.client);
      }
    });
  }

  getClient(): FHEVMClient {
    if (!this.client) {
      throw new Error('FHEVM client not initialized');
    }
    return this.client;
  }

  subscribe(callback: (client: FHEVMClient) => void): () => void {
    this.subscribers.add(callback);

    // If already initialized, call immediately
    if (this.client) {
      callback(this.client);
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

/**
 * Create universal provider instance
 */
export function createUniversalProvider(): UniversalProvider {
  return new UniversalProvider();
}
