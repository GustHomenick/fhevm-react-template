'use client';

import { useState } from 'react';
import { createKeyManager } from '@/lib/fhe/keys';

export function KeyManager() {
  const [contractAddress, setContractAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPublicKey = async () => {
    if (!contractAddress) {
      setError('Contract address is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keyManager = createKeyManager({
        contractAddress,
        chainId: 8009,
      });

      const key = await keyManager.getPublicKey(contractAddress);
      setPublicKey(key);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch public key';
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Key Manager</h2>

      {error && (
        <div className="text-red-600 mb-4">Error: {error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>

        <button
          onClick={handleGetPublicKey}
          disabled={isLoading || !contractAddress}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Fetching...' : 'Get Public Key'}
        </button>

        {publicKey && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Public Key:</h3>
            <div className="text-xs break-all font-mono">
              {publicKey}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
