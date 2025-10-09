'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { FHEVMClient } from '@fhevm/sdk';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  value: string;
  isActive: boolean;
}

interface ArtworkListProps {
  fhevmClient: FHEVMClient;
  userAddress: string;
}

export default function ArtworkList({ fhevmClient, userAddress }: ArtworkListProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Mock data for demonstration
      // In production, you would fetch from contract events or storage
      const mockArtworks: Artwork[] = [
        {
          id: 1,
          title: 'Starry Night',
          artist: 'Vincent van Gogh',
          value: '1000000',
          isActive: true,
        },
        {
          id: 2,
          title: 'The Persistence of Memory',
          artist: 'Salvador Dali',
          value: '750000',
          isActive: true,
        },
        {
          id: 3,
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          value: '850000',
          isActive: true,
        },
      ];

      setArtworks(mockArtworks);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Available Artworks
        </h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Available Artworks
      </h2>

      <div className="space-y-4">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
              selectedArtwork === artwork.id
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
            onClick={() => setSelectedArtwork(artwork.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {artwork.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Artist: {artwork.artist}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated Value: ${Number(artwork.value).toLocaleString()}
                </p>
              </div>
              <div>
                {artwork.isActive && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </div>

            {selectedArtwork === artwork.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Selected for investment
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {artworks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No artworks available at the moment.
        </div>
      )}
    </div>
  );
}
