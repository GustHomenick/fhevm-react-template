'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { encryptValue, type FHEVMClient } from '@fhevm/sdk';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

interface InvestmentFormProps {
  fhevmClient: FHEVMClient;
  userAddress: string;
}

export default function InvestmentForm({ fhevmClient, userAddress }: InvestmentFormProps) {
  const { data: walletClient } = useWalletClient();
  const [artworkId, setArtworkId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleInvest() {
    if (!artworkId || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (!walletClient) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount);

      // Encrypt the investment amount using FHEVM SDK
      const encrypted = await encryptValue(fhevmClient, amountInWei, {
        contractAddress: CONTRACT_ADDRESS,
        userAddress: userAddress,
      });

      // Get contract instance
      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Submit encrypted investment
      const tx = await contract.invest(
        artworkId,
        encrypted.data,
        encrypted.inputProof,
        {
          value: amountInWei,
          gasLimit: 500000,
        }
      );

      setSuccess('Transaction submitted! Waiting for confirmation...');

      // Wait for transaction confirmation
      await tx.wait();

      setSuccess('Investment successful! Your amount is encrypted on-chain.');
      setArtworkId('');
      setAmount('');
    } catch (err: any) {
      console.error('Investment failed:', err);
      setError(err.message || 'Investment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Make Investment
      </h2>

      <div className="space-y-4">
        {/* Artwork ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Artwork ID
          </label>
          <input
            type="number"
            value={artworkId}
            onChange={(e) => setArtworkId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter artwork ID"
            disabled={loading}
          />
        </div>

        {/* Investment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Investment Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="0.0"
            disabled={loading}
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            🔒 Your investment amount will be encrypted using FHE technology. Nobody, including contract owners, can see your investment amount.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleInvest}
          disabled={loading || !artworkId || !amount}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
              Processing...
            </span>
          ) : (
            'Invest with FHE Encryption'
          )}
        </button>
      </div>
    </div>
  );
}
