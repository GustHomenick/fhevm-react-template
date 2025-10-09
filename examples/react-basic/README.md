# React Basic - FHEVM SDK Example

Basic React application demonstrating FHEVM SDK integration.

## Features

- ✅ FHEVM SDK integration with React hooks
- ✅ Wallet connection with ConnectKit
- ✅ Encryption demonstration
- ✅ TypeScript support
- ✅ Vite for fast development

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_CONTRACT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3001

## SDK Usage

This example demonstrates:

### 1. Client Initialization

```typescript
import { createFHEVMClient } from '@fhevm/sdk';

const client = await createFHEVMClient({
  chainId: 11155111,
  provider: 'https://sepolia.infura.io/v3/...',
  debug: true,
});
```

### 2. React Hooks

```typescript
import { useFHEVM, useEncrypt } from '@fhevm/sdk';

function MyComponent() {
  const { client, isReady } = useFHEVM(fhevmClient);
  const { encrypt, isEncrypting } = useEncrypt(
    client,
    contractAddress,
    userAddress
  );

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42);
    // Use encrypted data in contract
  };
}
```

### 3. Encryption

```typescript
import { encryptValue } from '@fhevm/sdk';

const encrypted = await encryptValue(client, 100, {
  contractAddress: '0x...',
  userAddress: '0x...',
});

// Use encrypted.data and encrypted.inputProof in contract calls
```

## Project Structure

```
react-basic/
├── src/
│   ├── App.tsx           # Main component with FHEVM integration
│   ├── App.css           # Styles
│   ├── main.tsx          # Entry point with providers
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Integration with FHEVM SDK

This example uses the FHEVM SDK from the monorepo:

```json
{
  "dependencies": {
    "@fhevm/sdk": "file:../../packages/fhevm-sdk"
  }
}
```

The SDK provides:
- `createFHEVMClient` - Initialize FHEVM client
- `useFHEVM` - React hook for client state
- `useEncrypt` - React hook for encryption
- `useDecrypt` - React hook for decryption
- `encryptValue` - Direct encryption function

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Main Project README](../../README.md)
- [Setup Guide](../../SETUP.md)

## License

MIT
