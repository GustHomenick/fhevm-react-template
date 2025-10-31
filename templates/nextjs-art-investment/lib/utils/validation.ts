/**
 * Validation Utilities
 * Provides input validation helper functions
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEncryptionInput(
  value: any,
  contractAddress: string,
  userAddress: string
): ValidationResult {
  if (value === null || value === undefined) {
    return { valid: false, error: 'Value cannot be null or undefined' };
  }

  if (!contractAddress || !isValidAddress(contractAddress)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (!userAddress || !isValidAddress(userAddress)) {
    return { valid: false, error: 'Invalid user address' };
  }

  return { valid: true };
}

export function validateDecryptionInput(
  handle: string,
  contractAddress: string,
  signature?: string,
  publicDecrypt?: boolean
): ValidationResult {
  if (!handle || !isValidHandle(handle)) {
    return { valid: false, error: 'Invalid encrypted handle' };
  }

  if (!contractAddress || !isValidAddress(contractAddress)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (!publicDecrypt && !signature) {
    return { valid: false, error: 'Signature required for user-specific decryption' };
  }

  return { valid: true };
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(handle);
}

export function isValidChainId(chainId: number): boolean {
  return chainId > 0 && chainId < 1000000;
}

export function isValidAmount(amount: number): boolean {
  return amount >= 0 && Number.isFinite(amount);
}

export function validateAPIRequest(body: any, requiredFields: string[]): ValidationResult {
  for (const field of requiredFields) {
    if (!(field in body)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  return { valid: true };
}

export function sanitizeString(str: string, maxLength: number = 1000): string {
  return str.slice(0, maxLength).replace(/[<>]/g, '');
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
