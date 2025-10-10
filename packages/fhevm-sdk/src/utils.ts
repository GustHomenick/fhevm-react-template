/**
 * Utility functions for FHEVM SDK
 */

import { ethers } from 'ethers';

/**
 * Format encrypted handle for display
 */
export function formatHandle(handle: string): string {
  if (handle.length <= 10) return handle;
  return `${handle.slice(0, 6)}...${handle.slice(-4)}`;
}

/**
 * Check if value is encrypted handle
 */
export function isEncryptedHandle(value: any): boolean {
  if (typeof value !== 'string') return false;
  return value.startsWith('0x') && value.length === 66;
}

/**
 * Convert bigint to number safely
 */
export function bigIntToNumber(value: bigint): number {
  const num = Number(value);
  if (!Number.isSafeInteger(num)) {
    throw new Error('Value too large to convert to safe integer');
  }
  return num;
}

/**
 * Format wei to ether
 */
export function formatEther(value: bigint): string {
  return ethers.formatEther(value);
}

/**
 * Parse ether to wei
 */
export function parseEther(value: string): bigint {
  return ethers.parseEther(value);
}

/**
 * Delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
  } = options;

  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delayMs = Math.min(baseDelay * Math.pow(2, i), maxDelay);
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Get short address format
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Convert address to checksum format
 */
export function toChecksumAddress(address: string): string {
  return ethers.getAddress(address);
}

/**
 * Create error with context
 */
export class FHEVMError extends Error {
  constructor(
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'FHEVMError';
  }
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T = any>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects
 */
export function mergeDeep<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      if (!targetValue || typeof targetValue !== 'object') {
        target[key] = {} as any;
      }
      mergeDeep(targetValue, sourceValue);
    } else {
      target[key] = sourceValue as any;
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * Create debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Create throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate random ID
 */
export function generateId(prefix = 'fhevm'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running in Node.js
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'mainnet',
    5: 'goerli',
    11155111: 'sepolia',
    8009: 'zama',
  };

  return networks[chainId] || `unknown-${chainId}`;
}

/**
 * Format gas value
 */
export function formatGas(gas: bigint): string {
  const gasNumber = Number(gas);

  if (gasNumber < 1000) return `${gasNumber}`;
  if (gasNumber < 1000000) return `${(gasNumber / 1000).toFixed(2)}K`;
  return `${(gasNumber / 1000000).toFixed(2)}M`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(
  value: number | bigint,
  total: number | bigint
): number {
  const valueNum = typeof value === 'bigint' ? Number(value) : value;
  const totalNum = typeof total === 'bigint' ? Number(total) : total;

  if (totalNum === 0) return 0;
  return (valueNum / totalNum) * 100;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number | bigint): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate string
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
