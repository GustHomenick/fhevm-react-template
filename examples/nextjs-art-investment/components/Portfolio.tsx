'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import { userDecrypt, type FHEVMClient } from '@fhevm/sdk';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

interface PortfolioProps {
  fhevmClient: FHEVMClient;
  userAddress: string;
}

interface Investment {
  artworkId: number;
  encryptedAmount: string;
  decryptedAmount?: string;
  timestamp: number;
}

export default function Portfolio({ fhevmClient, userAddress }: PortfolioProps) {
  const { data: walletClient } = useWalletClient();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState<number | null>(null);

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    setLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Mock data for demonstration
      // In production, you would query contract events or storage
      const mockInvestments: Investment[] = [
        {
          artworkId: 1,
          encryptedAmount: '0x1234...', // This would be actual encrypted handle
          timestamp: Date.now() - 3600000,
        },
      ];

      setInvestments(mockInvestments);
    } catch (error) {
      console.error('Failed to load investments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecrypt(investmentIndex: number) {
    if (!walletClient) return;

    setDecrypting(investmentIndex);
    try {
      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      const investment = investments[investmentIndex];

      // Decrypt the encrypted amount using FHEVM SDK
      const result = await userDecrypt(
        fhevmClient,
        investment.encryptedAmount,
        signer,
        CONTRACT_ADDRESS
      );

      // Update investment with decrypted amount
      const updatedInvestments = [...investments];
      updatedInvestments[investmentIndex].decryptedAmount = ethers.formatEther(
        result.value.toString()
      );
      setInvestments(updatedInvestments);
    } catch (error) {
      console.error('Decryption failed:', error);
    } finally {
      setDecrypting(null);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        My Portfolio
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : investments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No investments yet.</p>
          <p className="text-sm mt-2">Start investing to see your portfolio here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((investment, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Artwork ID: <span className="font-semibold">{investment.artworkId}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(investment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Encrypted/Decrypted Amount */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Investment Amount</p>
                {investment.decryptedAmount ? (
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {investment.decryptedAmount} ETH
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    🔒 Encrypted: {investment.encryptedAmount.substring(0, 10)}...
                  </p>
                )}
              </div>

              {/* Decrypt Button */}
              {!investment.decryptedAmount && (
                <button
                  onClick={() => handleDecrypt(index)}
                  disabled={decrypting === index}
                  className="w-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {decrypting === index ? (
                    <span className="flex items-center justify-center">
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-purple-700 border-t-transparent mr-2"></span>
                      Decrypting...
                    </span>
                  ) : (
                    'Decrypt Amount'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          ℹ️ Only you can decrypt your investment amounts using your wallet signature (EIP-712).
        </p>
      </div>
    </div>
  );
}
