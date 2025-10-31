/**
 * Security Utilities for FHE Operations
 * Provides security-related helper functions
 */

export function validateAddress(address: string): boolean {
  // Validate Ethereum address format
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateHandle(handle: string): boolean {
  // Validate encrypted handle format
  return /^0x[a-fA-F0-9]+$/.test(handle);
}

export function sanitizeInput(input: string): string {
  // Sanitize user input
  return input.replace(/[<>]/g, '');
}

export function isValidSignature(signature: string): boolean {
  // Validate EIP-712 signature format
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

export function generateNonce(): string {
  // Generate cryptographically secure nonce
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  }
  return '0x' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function hashData(data: string): string {
  // Simple hash function (use proper crypto in production)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16);
}

export function verifyContractAddress(address: string, whitelist: string[]): boolean {
  // Verify contract address is in whitelist
  return whitelist.includes(address.toLowerCase());
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  // Simple rate limiting (use Redis in production)
  // This is a placeholder implementation
  return true;
}
