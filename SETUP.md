# Setup Guide - Universal FHEVM SDK

Complete setup guide for the FHEVM SDK and examples.

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- MetaMask or compatible wallet
- Test ETH on Sepolia testnet

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd fhevm-react-template
```

### 2. Install All Dependencies

```bash
# Install from root (includes all packages and examples)
npm run install:all

# Or install individually
npm install              # Root dependencies
npm run install:sdk      # SDK only
npm run install:nextjs   # Next.js example
npm run install:react    # React example
npm run install:vue      # Vue example
npm run install:node     # Node.js example
```

### 3. Build SDK

```bash
npm run build:sdk
```

### 4. Setup Environment Variables

#### For Next.js Example

Create `examples/nextjs-art-investment/.env.local`:

```env
# Network Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Contract (will be filled after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Optional: Gas Configuration
NEXT_PUBLIC_GAS_LIMIT=auto
```

#### For Hardhat Deployment

Create `examples/nextjs-art-investment/.env`:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 5. Compile Smart Contracts

```bash
cd examples/nextjs-art-investment
npm run compile
```

### 6. Deploy Contracts (Optional)

```bash
# Deploy to Sepolia testnet
npm run deploy

# Copy the deployed contract address to .env.local
# NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 7. Run Examples

#### Next.js (Primary Example)

```bash
cd examples/nextjs-art-investment
npm run dev
# Open http://localhost:3000
```

#### React

```bash
cd examples/react-basic
npm start
# Open http://localhost:3001
```

#### Vue.js

```bash
cd examples/vue-app
npm run dev
# Open http://localhost:5173
```

#### Node.js CLI

```bash
cd examples/nodejs-cli
npm start
```

## SDK Usage in Your Project

### Install SDK

```bash
npm install @fhevm/sdk ethers fhevmjs
```

### Basic Integration

```typescript
import { createFHEVMClient, encryptValue } from '@fhevm/sdk';

// 1. Initialize client
const client = await createFHEVMClient({
  chainId: 11155111,
  provider: 'https://sepolia.infura.io/v3/YOUR_KEY'
});

// 2. Encrypt value
const encrypted = await encryptValue(client, 100, {
  contractAddress: '0x...',
  userAddress: '0x...'
});

// 3. Use in contract
await contract.submitValue(encrypted.data, encrypted.inputProof);
```

### React Integration

```typescript
import { useFHEVM, useEncrypt, useDecrypt } from '@fhevm/sdk';

function MyComponent() {
  const { client, isReady } = useFHEVM(fhevmClient);
  const { encrypt } = useEncrypt(client, contractAddress, userAddress);
  const { decrypt } = useDecrypt(client, contractAddress, signer);

  // Use encrypt/decrypt in your component
}
```

## Development Workflow

### 1. SDK Development

```bash
cd packages/fhevm-sdk

# Watch mode for development
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

### 2. Example Development

```bash
# Start any example in development mode
npm run dev:nextjs   # Next.js
npm run dev:react    # React
npm run dev:vue      # Vue
npm run dev:node     # Node.js
```

### 3. Testing

```bash
# Test SDK
cd packages/fhevm-sdk
npm test

# Test contracts
cd examples/nextjs-art-investment
npx hardhat test
```

## Troubleshooting

### Issue: SDK not found in examples

**Solution**: Build the SDK first

```bash
cd packages/fhevm-sdk
npm run build
```

### Issue: Contract compilation fails

**Solution**: Install dependencies

```bash
cd examples/nextjs-art-investment
npm install
```

### Issue: Next.js shows "Module not found"

**Solution**: Ensure SDK is linked

```bash
# From root
npm run build:sdk

# From Next.js example
npm install
```

### Issue: Transaction fails with "insufficient funds"

**Solution**: Get test ETH from Sepolia faucet

- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/

### Issue: FHEVM initialization fails

**Solution**: Check network configuration

```typescript
// Ensure correct chain ID and RPC URL
const client = await createFHEVMClient({
  chainId: 11155111,  // Sepolia
  provider: 'https://sepolia.infura.io/v3/YOUR_KEY'
});
```

## Project Commands

### Root Level

```bash
npm install          # Install all dependencies
npm run build        # Build SDK
npm test            # Run SDK tests
npm run clean       # Clean all node_modules
```

### SDK Level

```bash
cd packages/fhevm-sdk
npm run build       # Build SDK
npm run dev         # Watch mode
npm test            # Run tests
npm run lint        # Lint code
```

### Example Level

```bash
cd examples/nextjs-art-investment
npm run dev         # Start dev server
npm run build       # Build for production
npm run compile     # Compile contracts
npm run deploy      # Deploy contracts
npm test           # Run contract tests
```

## Deployment

### Deploy Next.js Example

```bash
cd examples/nextjs-art-investment

# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Deploy Smart Contracts

```bash
cd examples/nextjs-art-investment

# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Getting Test ETH

### Sepolia Faucets

1. **Alchemy Faucet**: https://sepoliafaucet.com/
2. **Infura Faucet**: https://www.infura.io/faucet/sepolia
3. **PoW Faucet**: https://sepolia-faucet.pk910.de/

### Request ETH

1. Visit faucet website
2. Enter your wallet address
3. Complete verification (if required)
4. Receive test ETH (usually within minutes)

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Deploy smart contract
3. ✅ Run Next.js example
4. ✅ Explore SDK documentation
5. ✅ Build your own confidential dApp!

## Support

### Documentation

- [Main README](./README.md)
- [SDK Documentation](./packages/fhevm-sdk/README.md)
- [Next.js Example](./examples/nextjs-art-investment/README.md)

### External Resources

- [FHEVM Documentation](https://docs.zama.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

### Community

- [Discord](https://discord.gg/zama)
- [GitHub Issues](https://github.com/.../issues)

---

**Setup Time**: ~10 minutes
**Difficulty**: Beginner-friendly
**Support**: Full documentation and examples included
