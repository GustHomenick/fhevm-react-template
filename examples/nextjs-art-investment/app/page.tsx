'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { createFHEVMClient, type FHEVMClient } from '@fhevm/sdk';
import ArtworkList from '@/components/ArtworkList';
import InvestmentForm from '@/components/InvestmentForm';
import Portfolio from '@/components/Portfolio';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [fhevmClient, setFhevmClient] = useState<FHEVMClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    async function initFHEVM() {
      if (!isConnected || fhevmClient) return;

      setIsInitializing(true);
      try {
        const client = await createFHEVMClient({
          chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
          provider: process.env.NEXT_PUBLIC_RPC_URL || '',
          debug: true,
        });
        setFhevmClient(client);
      } catch (error) {
        console.error('Failed to initialize FHEVM client:', error);
      } finally {
        setIsInitializing(false);
      }
    }

    initFHEVM();
  }, [isConnected, fhevmClient]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Private Art Investment
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Invest in fine art with complete privacy using FHE encryption
            </p>
          </div>
          <ConnectKitButton />
        </header>

        {/* Content */}
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Welcome to Private Art Investment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect your wallet to start investing in fine art with complete privacy protection.
              </p>
              <ConnectKitButton />
            </div>
          </div>
        ) : isInitializing ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Initializing FHEVM client...
            </p>
          </div>
        ) : fhevmClient ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Artwork List */}
            <div className="lg:col-span-2">
              <ArtworkList
                fhevmClient={fhevmClient}
                userAddress={address!}
              />
            </div>

            {/* Right Column - Investment & Portfolio */}
            <div className="space-y-6">
              <InvestmentForm
                fhevmClient={fhevmClient}
                userAddress={address!}
              />
              <Portfolio
                fhevmClient={fhevmClient}
                userAddress={address!}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400">
              Failed to initialize FHEVM client. Please refresh and try again.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
