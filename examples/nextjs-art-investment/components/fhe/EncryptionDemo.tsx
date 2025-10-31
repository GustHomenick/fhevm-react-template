'use client';

import { useState } from 'react';
import { useFHEContext } from './FHEProvider';
import { useEncryption } from '@/hooks/useEncryption';

export function EncryptionDemo() {
  const { client, isReady } = useFHEContext();
  const [value, setValue] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [result, setResult] = useState<any>(null);

  const { encrypt, isEncrypting, error } = useEncryption(client, contractAddress, userAddress);

  const handleEncrypt = async () => {
    try {
      const encrypted = await encrypt(value);
      setResult(encrypted);
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Encryption Demo</h2>

      {!isReady && (
        <div className="text-yellow-600 mb-4">Initializing FHE client...</div>
      )}

      {error && (
        <div className="text-red-600 mb-4">Error: {error.message}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Value to Encrypt
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter value..."
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium mb-2">
            User Address
          </label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={!isReady || isEncrypting || !value || !contractAddress || !userAddress}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Encrypted Result:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
