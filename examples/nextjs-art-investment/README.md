# Next.js Art Investment Platform

Privacy-preserving art investment platform built with Next.js 14 and FHEVM SDK.

## Features

- 🎨 **Private Investments**: Investment amounts encrypted with FHE
- 🔒 **Encrypted Portfolios**: Portfolio balances remain confidential
- 🔑 **User Decryption**: EIP-712 signed decryption for users only
- ⚡ **Next.js 14**: Modern App Router with Server Components
- 🎯 **FHEVM SDK Integration**: Using universal SDK from monorepo

## Quick Start

### Prerequisites

- Node.js >= 16
- MetaMask or compatible wallet
- Test ETH on Sepolia

### Installation

```bash
# From repo root
cd examples/nextjs-art-investment
npm install
```

### Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Deploy Contract

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy
```

## Project Structure

```
nextjs-art-investment/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── invest/            # Investment pages
│   └── portfolio/         # Portfolio pages
│
├── contracts/             # Smart contracts
│   └── PrivateArtInvestment.sol
│
├── lib/                   # SDK integration
│   ├── fhevm.ts          # FHEVM client setup
│   └── hooks.ts          # Custom hooks
│
├── components/            # React components
│   ├── ArtworkCard.tsx
│   ├── InvestmentForm.tsx
│   └── PortfolioView.tsx
│
└── scripts/              # Deployment scripts
    └── deploy.js
```

## SDK Integration

### Initialize FHEVM Client

```typescript
// lib/fhevm.ts
import { createFHEVMClient } from '@fhevm/sdk';

export const fhevmClient = await createFHEVMClient({
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  provider: process.env.NEXT_PUBLIC_RPC_URL!
});
```

### Use in Components

```typescript
'use client';

import { useFHEVM, useEncrypt, useDecrypt } from '@fhevm/sdk';
import { fhevmClient } from '@/lib/fhevm';

export function InvestmentForm() {
  const { client, isReady } = useFHEVM(fhevmClient);
  const { encrypt, isEncrypting } = useEncrypt(
    client,
    contractAddress,
    userAddress
  );

  const handleInvest = async (amount: number) => {
    const encrypted = await encrypt(amount);
    await contract.makePrivateInvestment(
      artworkId,
      encrypted.data,
      encrypted.inputProof,
      { value: ethers.parseEther(amount.toString()) }
    );
  };

  return (
    // Your component JSX
  );
}
```

## Features Showcase

### 1. Register as Investor

Users register to create encrypted investment profile:

```typescript
const tx = await contract.registerInvestor();
await tx.wait();
```

### 2. Make Private Investment

Encrypt investment amount before submitting:

```typescript
const encrypted = await encrypt(investmentAmount);
const tx = await contract.makePrivateInvestment(
  artworkId,
  shares,
  encrypted.data,
  encrypted.inputProof
);
```

### 3. View Encrypted Portfolio

Decrypt portfolio data with user signature:

```typescript
const handle = await contract.getEncryptedBalance(userAddress);
const { decrypt } = useDecrypt(client, contractAddress, signer);
const balance = await decrypt(handle);
```

## Smart Contract

Using `PrivateArtInvestment.sol` from main project:

- Private investment amounts (FHE encrypted)
- Encrypted portfolio tracking
- User-specific decryption
- Returns distribution

## Deployment

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`

## Live Demo

**URL**: [https://art-investment.vercel.app](#)

## Screenshots

[Add screenshots here]

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Blockchain**: Ethers.js v6
- **Privacy**: FHEVM SDK
- **Deployment**: Vercel

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Main README](../../README.md)
- [Zama Documentation](https://docs.zama.ai)

## License

MIT
