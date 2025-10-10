import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import {
  createFHEVMClient,
  useFHEVM,
  useEncrypt,
  useDecrypt,
  type FHEVMClient
} from '@fhevm/sdk';
import './App.css';

// Contract configuration
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

function App() {
  const { address, isConnected } = useAccount();
  const [fhevmClient, setFhevmClient] = useState<FHEVMClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize FHEVM client when connected
  useEffect(() => {
    async function initFHEVM() {
      if (!isConnected || fhevmClient) return;

      setIsInitializing(true);
      try {
        const client = await createFHEVMClient({
          chainId: Number(import.meta.env.VITE_CHAIN_ID || 11155111),
          provider: import.meta.env.VITE_RPC_URL || '',
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
    <div className="app">
      <header className="app-header">
        <h1>FHEVM React Demo</h1>
        <ConnectKitButton />
      </header>

      <main className="app-main">
        {!isConnected ? (
          <div className="welcome-card">
            <h2>Welcome to FHEVM SDK</h2>
            <p>Connect your wallet to start using fully homomorphic encryption</p>
            <ConnectKitButton />
          </div>
        ) : isInitializing ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Initializing FHEVM client...</p>
          </div>
        ) : fhevmClient ? (
          <DemoSection
            fhevmClient={fhevmClient}
            userAddress={address!}
          />
        ) : (
          <div className="error-card">
            <p>Failed to initialize FHEVM client</p>
          </div>
        )}
      </main>
    </div>
  );
}

function DemoSection({
  fhevmClient,
  userAddress
}: {
  fhevmClient: FHEVMClient;
  userAddress: string;
}) {
  const { client, isReady } = useFHEVM(fhevmClient);
  const { encrypt, isEncrypting } = useEncrypt(client, CONTRACT_ADDRESS, userAddress);
  const [value, setValue] = useState('');
  const [encryptedValue, setEncryptedValue] = useState<string>('');

  async function handleEncrypt() {
    if (!value) return;

    try {
      const encrypted = await encrypt(BigInt(value));
      setEncryptedValue(JSON.stringify(encrypted, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
      ).substring(0, 100) + '...');
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  }

  return (
    <div className="demo-section">
      <div className="card">
        <h2>Encryption Demo</h2>
        <p className="card-description">
          Encrypt a number using FHE. The encrypted value can be used in smart contracts
          while keeping the original value private.
        </p>

        <div className="input-group">
          <label>Value to Encrypt</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
            disabled={isEncrypting}
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={isEncrypting || !value || !isReady}
          className="primary-button"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>

        {encryptedValue && (
          <div className="result-box">
            <h3>Encrypted Result:</h3>
            <pre>{encryptedValue}</pre>
          </div>
        )}
      </div>

      <div className="info-card">
        <h3>How it works</h3>
        <ol>
          <li>Enter a numeric value</li>
          <li>Click "Encrypt Value" to encrypt using FHE</li>
          <li>The encrypted data can be sent to smart contracts</li>
          <li>Computations can be performed on encrypted data</li>
          <li>Only authorized users can decrypt the results</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
