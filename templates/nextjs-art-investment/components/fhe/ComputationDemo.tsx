'use client';

import { useState } from 'react';
import { useFHEContext } from './FHEProvider';
import { useComputation } from '@/hooks/useComputation';

export function ComputationDemo() {
  const { client, isReady } = useFHEContext();
  const [operation, setOperation] = useState<string>('add');
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [result, setResult] = useState<any>(null);

  const { compute, isComputing, error } = useComputation(client, contractAddress);

  const operations = ['add', 'sub', 'mul', 'div', 'eq', 'lt', 'gt'];

  const handleCompute = async () => {
    try {
      const computed = await compute(operation as any, [operand1, operand2]);
      setResult(computed);
    } catch (err) {
      console.error('Computation error:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">FHE Computation Demo</h2>

      {!isReady && (
        <div className="text-yellow-600 mb-4">Initializing FHE client...</div>
      )}

      {error && (
        <div className="text-red-600 mb-4">Error: {error.message}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {operations.map((op) => (
              <option key={op} value={op}>
                {op.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            First Operand (encrypted handle)
          </label>
          <input
            type="text"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Second Operand (encrypted handle)
          </label>
          <input
            type="text"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
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

        <button
          onClick={handleCompute}
          disabled={!isReady || isComputing || !operand1 || !operand2 || !contractAddress}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isComputing ? 'Computing...' : 'Compute'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Computation Result:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
