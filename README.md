# Universal FHEVM SDK

> A framework-agnostic SDK for building confidential applications with Fully Homomorphic Encryption

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://fhe-art-investment.vercel.app/)

## 🎯 Overview

This project provides a **universal, developer-friendly FHEVM SDK** that makes building confidential frontends simple, consistent, and intuitive across any JavaScript framework.

### Key Features

- ✅ **Framework Agnostic** - Works with React, Vue, Next.js, Node.js, and vanilla JS
- ✅ **Wagmi-like API** - Familiar hooks and patterns for Web3 developers
- ✅ **< 10 Lines to Start** - Minimal setup, maximum productivity
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Modular Architecture** - Import only what you need
- ✅ **Production Ready** - Complete examples and documentation

### Live Examples

🌐 **Live Demo**: [https://fhe-art-investment.vercel.app/](https://fhe-art-investment.vercel.app/)

🔗 **GitHub Repository**: [https://github.com/GustHomenick/fhevm-react-template](https://github.com/GustHomenick/fhevm-react-template)

🎥 **Demo Video**: Download and watch `demo.mp4` from the repository (video cannot be viewed directly via link)

## 🚀 Quick Start

### Installation

```bash
# Install from root
npm install

# Or install SDK only
cd packages/fhevm-sdk
npm install
```

### Basic Usage (< 10 lines!)

```typescript
import { createFHEVMClient, encryptValue } from '@fhevm/sdk';

// Initialize
const client = await createFHEVMClient({
  chainId: 8009,
  provider: 'https://devnet.zama.ai'
});

// Encrypt & use
const encrypted = await encryptValue(client, 42, {
  contractAddress: '0x...',
  userAddress: '0x...'
});
```

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # 🎯 Universal FHEVM SDK
│       ├── src/
│       │   ├── index.ts        # Main exports
│       │   ├── core.ts         # Core client functionality
│       │   ├── encryption.ts   # Encryption utilities
│       │   ├── decryption.ts   # Decryption with EIP-712
│       │   ├── hooks.ts        # React hooks (wagmi-like)
│       │   ├── adapters.ts     # Framework adapters
│       │   ├── utils.ts        # Helper functions (40+)
│       │   └── types.ts        # TypeScript definitions
│       ├── package.json
│       └── README.md           # SDK documentation
│
├── examples/
│   ├── nextjs-art-investment/  # 🎨 Next.js Example (Complete)
│   │   ├── app/                # Next.js 14 App Router
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Main page
│   │   │   ├── providers.tsx   # Wagmi providers
│   │   │   ├── globals.css     # Global styles
│   │   │   └── api/            # API Routes
│   │   │       ├── fhe/        # FHE Operations
│   │   │       │   ├── route.ts         # Main FHE route
│   │   │       │   ├── encrypt/route.ts # Encryption endpoint
│   │   │       │   ├── decrypt/route.ts # Decryption endpoint
│   │   │       │   └── compute/route.ts # Computation endpoint
│   │   │       └── keys/route.ts        # Key management
│   │   ├── components/         # React components
│   │   │   ├── ui/             # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── fhe/            # FHE components
│   │   │   │   ├── FHEProvider.tsx      # FHE context provider
│   │   │   │   ├── EncryptionDemo.tsx   # Encryption demo
│   │   │   │   ├── ComputationDemo.tsx  # Computation demo
│   │   │   │   └── KeyManager.tsx       # Key management
│   │   │   ├── ArtworkList.tsx
│   │   │   ├── InvestmentForm.tsx
│   │   │   └── Portfolio.tsx
│   │   ├── lib/                # Utilities
│   │   │   ├── fhe/            # FHE integration
│   │   │   │   ├── client.ts   # Client operations
│   │   │   │   ├── server.ts   # Server operations
│   │   │   │   ├── keys.ts     # Key management
│   │   │   │   └── types.ts    # FHE types
│   │   │   ├── utils/          # Utility functions
│   │   │   │   ├── security.ts # Security utilities
│   │   │   │   └── validation.ts # Validation helpers
│   │   │   └── contract.ts     # Contract ABI & address
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useFHE.ts       # Main FHE hook
│   │   │   ├── useEncryption.ts # Encryption hook
│   │   │   └── useComputation.ts # Computation hook
│   │   ├── types/              # TypeScript types
│   │   │   ├── fhe.ts          # FHE types
│   │   │   └── api.ts          # API types
│   │   ├── contracts/          # Smart contracts
│   │   │   └── PrivateArtInvestment.sol
│   │   ├── hardhat.config.js
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   ├── react-basic/            # ⚛️ React Example (Complete)
│   │   ├── src/
│   │   │   ├── App.tsx         # Main component
│   │   │   ├── main.tsx        # Entry point
│   │   │   └── index.css       # Styles
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── vue-app/                # 🎭 Vue Example (Complete)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── DemoSection.vue
│   │   │   ├── App.vue         # Main app
│   │   │   ├── main.ts         # Entry point
│   │   │   └── style.css       # Styles
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── nodejs-cli/             # 🖥️ Node.js CLI (Complete)
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── encrypt.ts
│   │   │   │   ├── decrypt.ts
│   │   │   │   ├── info.ts
│   │   │   │   └── interactive.ts
│   │   │   └── index.ts        # CLI entry point
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── PrivateArtInvestment/   # 🎨 Private Art Investment (React + FHEVM)
│       ├── src/
│       │   ├── App.tsx         # Main component
│       │   ├── main.tsx        # Entry point
│       │   ├── components/     # React components
│       │   │   ├── Header.tsx
│       │   │   ├── StatsDisplay.tsx
│       │   │   ├── InvestorRegistration.tsx
│       │   │   ├── InvestmentForm.tsx
│       │   │   ├── ArtworkManagement.tsx
│       │   │   └── ArtworkGallery.tsx
│       │   ├── hooks/
│       │   │   └── useContract.ts
│       │   └── styles/
│       │       └── App.css
│       ├── contracts/          # Smart contracts
│       │   └── PrivateArtInvestment.sol
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── demo.md                     # 📹 Video demonstration guide
├── package.json                # Root package configuration
├── README.md                   # This file
├── SETUP.md                    # Complete setup guide
├── SUBMISSION.md               # Competition submission details
└── PROJECT-STATUS.md           # Project completion status
```

## 🎨 Next.js Art Investment Example

A complete privacy-preserving art investment platform built with Next.js 14.

**Location**: `examples/nextjs-art-investment/`

### Features

- 🎨 **Private Investments**: Investment amounts encrypted with FHE
- 🔒 **Encrypted Portfolios**: Portfolio balances remain confidential
- 🔑 **User Decryption**: EIP-712 signed decryption for authorized users
- ⚡ **Next.js 14**: Modern App Router architecture with API routes
- 🎯 **FHEVM SDK Integration**: Complete SDK usage demonstration
- 🛠️ **Complete FHE Stack**: Includes encryption, decryption, and computation APIs
- 🎨 **UI Components**: Reusable components for FHE operations
- 🔧 **Custom Hooks**: React hooks for seamless FHE integration
- 📦 **Type-Safe**: Full TypeScript support with comprehensive types

### Architecture Overview

The Next.js example includes a complete implementation following the structure outlined in the project requirements:

**API Routes** (`app/api/`):
- `/api/fhe/encrypt` - Encryption endpoint
- `/api/fhe/decrypt` - Decryption endpoint with EIP-712 support
- `/api/fhe/compute` - Homomorphic computation operations
- `/api/keys` - Key management and retrieval

**Components** (`components/`):
- **UI Components**: Button, Input, Card for consistent styling
- **FHE Components**: FHEProvider, EncryptionDemo, ComputationDemo, KeyManager
- **Business Logic**: ArtworkList, InvestmentForm, Portfolio

**Custom Hooks** (`hooks/`):
- `useFHE` - Main FHEVM client hook
- `useEncryption` - Encryption operations hook
- `useComputation` - Computation operations hook

**Library Utilities** (`lib/`):
- **FHE Integration**: Client/server operations, key management
- **Security**: Input validation and security utilities
- **Types**: Comprehensive TypeScript definitions

### Run the Example

```bash
cd examples/nextjs-art-investment
npm install
npm run dev
```

### Smart Contract

The example includes the **PrivateArtInvestment** smart contract:

- Private investment amounts (FHE encrypted)
- Encrypted portfolio tracking
- User-specific decryption capabilities
- Automated returns distribution
- Full Hardhat development environment

### Deploy Contract

```bash
cd examples/nextjs-art-investment
npm run compile
npm run deploy
```

**Live Demo**: [https://fhe-art-investment.vercel.app/](https://fhe-art-investment.vercel.app/)

## 📱 React Basic Example

Basic React application with FHEVM SDK integration.

**Location**: `examples/react-basic/`

### Features

- ⚛️ **React 18**: Modern React with hooks
- 🔗 **Wallet Integration**: ConnectKit for wallet connection
- 🔒 **Encryption Demo**: Interactive encryption demonstration
- ⚡ **Vite**: Fast development with HMR
- 🎯 **FHEVM Hooks**: useFHEVM, useEncrypt, useDecrypt

### Run the Example

```bash
cd examples/react-basic
npm install
npm run dev
```

## 🎭 Vue.js Example

Vue 3 application with Composition API and FHEVM SDK.

**Location**: `examples/vue-app/`

### Features

- 🌟 **Vue 3**: Composition API with TypeScript
- 🔧 **Vue Adapter**: Custom Vue adapter for FHEVM
- 💚 **Reactive State**: Vue reactive system integration
- 🎨 **SFC**: Single File Components
- ⚡ **Vite**: Lightning-fast development

### Run the Example

```bash
cd examples/vue-app
npm install
npm run dev
```

## 🖥️ Node.js CLI Example

Command-line interface for FHEVM operations.

**Location**: `examples/nodejs-cli/`

### Features

- 🔨 **CLI Tool**: Full-featured command-line interface
- 🎯 **Node Adapter**: Backend-focused FHEVM adapter
- 🔄 **Interactive Mode**: Beautiful prompts with Inquirer
- 📊 **Network Info**: Display network and configuration
- 🎨 **Beautiful UI**: Ora spinners and formatted output

### Run the Example

```bash
cd examples/nodejs-cli
npm install
npm run dev
```

### CLI Commands

```bash
# Interactive mode
fhevm-cli interactive

# Encrypt a value
fhevm-cli encrypt --value 42 --contract 0x... --user 0x...

# Decrypt a value
fhevm-cli decrypt --handle 0x... --contract 0x... --private-key 0x...

# Show network info
fhevm-cli info
```

## 🎨 Private Art Investment Example

React application for privacy-preserving art investments with FHEVM SDK.

**Location**: `examples/PrivateArtInvestment/`

### Features

- 🎨 **Art Platform**: Complete art investment platform
- 🔒 **Private Investments**: Encrypted investment amounts with FHE
- 🎭 **Artwork Management**: List and manage artworks on-chain
- 💼 **Investor Portal**: Register and track investments
- 📊 **Live Statistics**: Platform-wide stats and analytics
- ⚛️ **Modern React**: React 18 with TypeScript and Vite
- 🎯 **FHEVM SDK Integration**: Full SDK usage with hooks
- 🔗 **Wallet Connection**: ConnectKit for seamless wallet integration

### Run the Example

```bash
cd examples/PrivateArtInvestment
npm install
npm run dev
```

Visit `http://localhost:3002`

### Smart Contract

The example includes the **PrivateArtInvestment** smart contract:

- Private investment tracking
- Artwork listing and management
- Investor registration
- Returns distribution
- Full Hardhat development environment

### Deploy Contract

```bash
cd examples/PrivateArtInvestment
npm run compile
npm run deploy
```

## 🛠️ SDK Architecture

### Core Modules

#### 1. Core Module (`core.ts`)

Manages FHEVM client lifecycle and initialization:

```typescript
import { createFHEVMClient, FHEVMClient } from '@fhevm/sdk';

const client = await createFHEVMClient({
  chainId: 8009,
  provider: 'https://devnet.zama.ai',
  contractAddresses: {
    ACL: '0x...',
    TFHEExecutor: '0x...',
    KMSVerifier: '0x...'
  },
  debug: true
});

const instance = client.getInstance();
```

**Key Classes**:
- `FHEVMClient` - Main client class
- `createFHEVMClient()` - Factory function
- `getGlobalClient()` - Singleton pattern

#### 2. Encryption Module (`encryption.ts`)

Provides encryption utilities with fluent API:

```typescript
// Simple encryption
const encrypted = await encryptValue(client, 100, {
  contractAddress: '0x...',
  userAddress: '0x...'
});

// Builder pattern for multiple values
const encrypted = createInputBuilder(client, options)
  .add64(100)
  .addBool(true)
  .add32(42)
  .addAddress('0x...')
  .encrypt();
```

**Available Functions**:
- `encryptValue()` - Encrypt single value
- `encryptBool()` - Encrypt boolean
- `encryptArray()` - Encrypt multiple values
- `createInputBuilder()` - Fluent builder API
- `EncryptedInputBuilder` - Builder class

#### 3. Decryption Module (`decryption.ts`)

Handles both user and public decryption with EIP-712:

```typescript
// User decrypt (with EIP-712 signature)
const result = await userDecrypt(client, handle, signer, contractAddress);

// Public decrypt (no signature)
const result = await publicDecrypt(client, handle, contractAddress);

// Smart decrypt (automatic fallback)
const result = await smartDecrypt(client, handle, contractAddress, signer);

// Batch decryption
const results = await batchUserDecrypt(client, handles, signer, contractAddress);
```

**Key Functions**:
- `userDecrypt()` - User-specific decryption with signature
- `publicDecrypt()` - Public decryption
- `smartDecrypt()` - Auto-select best method
- `batchUserDecrypt()` - Decrypt multiple values
- `createDecryptionManager()` - Manager class

#### 4. Hooks Module (`hooks.ts`)

React hooks for seamless integration (wagmi-like):

```typescript
import { useFHEVM, useEncrypt, useDecrypt } from '@fhevm/sdk';

function MyComponent() {
  const { client, isReady, error } = useFHEVM(fhevmClient);

  const { encrypt, isEncrypting } = useEncrypt(
    client,
    contractAddress,
    userAddress
  );

  const { decrypt, isDecrypting } = useDecrypt(
    client,
    contractAddress,
    signer
  );

  const { data, isLoading, refetch } = useEncryptedRead(
    client,
    contractAddress,
    handle,
    signer
  );

  // Use in your component
}
```

**Available Hooks**:
- `useFHEVM()` - Use FHEVM client
- `useEncrypt()` - Encrypt values
- `useDecrypt()` - Decrypt values
- `useEncryptedRead()` - Read encrypted state
- `useEncryptedWrite()` - Write encrypted data
- `useEncryptedInput()` - Manage input builder
- `useEncryptedEvent()` - Watch encrypted events

#### 5. Adapters Module (`adapters.ts`)

Framework-specific integrations:

```typescript
// Vue.js Adapter
import { VueAdapter } from '@fhevm/sdk/adapters';
const vueAdapter = new VueAdapter(config);
const client = vueAdapter.getClient();

// Next.js Adapter (SSR-safe)
import { NextAdapter } from '@fhevm/sdk/adapters';
const nextAdapter = new NextAdapter(config);
const client = await nextAdapter.initializeClient();

// Node.js Adapter
import { createNodeAdapter } from '@fhevm/sdk/adapters';
const nodeAdapter = await createNodeAdapter(config);
const encrypted = await nodeAdapter.prepareEncryptedInput(value, contractAddress, userAddress);

// Universal Provider (framework-agnostic)
import { createUniversalProvider } from '@fhevm/sdk/adapters';
const provider = createUniversalProvider();
await provider.initialize(config);
```

**Adapter Classes**:
- `VueAdapter` - Vue 3 Composition API integration
- `NextAdapter` - Next.js SSR-safe integration
- `NodeAdapter` - Node.js backend integration
- `UniversalProvider` - Framework-agnostic pattern

#### 6. Utils Module (`utils.ts`)

40+ helper functions for common operations:

```typescript
import {
  formatHandle,
  shortenAddress,
  isValidAddress,
  retry,
  debounce,
  formatEther,
  parseEther,
  isEncryptedHandle,
  // ... and more
} from '@fhevm/sdk';

// Format display
const short = shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
// "0x742d...bEb"

// Retry with backoff
const result = await retry(async () => {
  return await fetchData();
}, { maxRetries: 3, baseDelay: 1000 });
```

**Utility Categories**:
- Address formatting and validation
- Handle formatting
- BigInt/Number conversion
- Retry and delay helpers
- Debounce/throttle functions
- Network helpers
- Gas formatting

#### 7. Types Module (`types.ts`)

Comprehensive TypeScript definitions:

```typescript
import type {
  FHEVMConfig,
  EncryptedInput,
  DecryptionResult,
  ContractInstance,
  Provider,
  EncryptionOptions,
  DecryptionOptions,
  HookConfig,
  TransactionOptions
} from '@fhevm/sdk';
```

## 🎯 Design Principles

1. **Simplicity** - Minimal boilerplate, maximum productivity
2. **Consistency** - Same API across all frameworks
3. **Flexibility** - Use as much or as little as needed
4. **Type Safety** - Full TypeScript support
5. **Documentation** - Clear examples and API docs

## 📊 Evaluation Criteria Coverage

### ✅ Usability

- **< 10 lines to start**: Demonstrated in Quick Start
- **Minimal boilerplate**: No complex setup required
- **Familiar API**: Wagmi-like hooks and patterns
- **Clear errors**: Helpful error messages

### ✅ Completeness

- **Initialization**: `createFHEVMClient` with full config
- **Encryption**: Multiple methods (simple, builder, typed)
- **Decryption**: User decrypt (EIP-712) + public decrypt
- **Contract Integration**: Full ethers.js compatibility
- **Event Handling**: Encrypted event watching

### ✅ Reusability

- **Core module**: Framework-agnostic base
- **Adapters**: Clean separation for each framework
- **Hooks**: Modular React integration
- **Utils**: Reusable helper functions (40+)
- **Types**: Shared TypeScript definitions

### ✅ Documentation

- **SDK README**: Complete API reference
- **Example README**: Step-by-step guide
- **Code Comments**: Inline documentation
- **Setup Guide**: Comprehensive instructions
- **This README**: Full overview

### ✅ Creativity

- **Multi-framework support**: React, Vue, Next.js, Node.js adapters
- **Real use case**: Art investment platform
- **Advanced patterns**: Builder API, Smart decrypt
- **Best practices**: TypeScript, error handling, SSR-safe

## 📚 Documentation

### Complete Documentation Files

1. **[README.md](./README.md)** - This file (project overview)
2. **[packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)** - SDK API reference
3. **[examples/nextjs-art-investment/README.md](./examples/nextjs-art-investment/README.md)** - Next.js example guide
4. **[SETUP.md](./SETUP.md)** - Complete setup instructions
5. **[SUBMISSION.md](./SUBMISSION.md)** - Competition submission details
6. **[demo.md](./demo.md)** - Video demonstration guide

### Quick Links

- [SDK API Documentation](./packages/fhevm-sdk/README.md)
- [Next.js Example Setup](./examples/nextjs-art-investment/README.md)
- [Installation Guide](./SETUP.md)
- [Submission Details](./SUBMISSION.md)

## 🚀 Development

### Install All Dependencies

```bash
npm install
```

### Build SDK

```bash
npm run build:sdk
# or
cd packages/fhevm-sdk && npm run build
```

### Run Next.js Example

```bash
npm run dev:nextjs
# or
cd examples/nextjs-art-investment && npm run dev
```

### Compile Smart Contracts

```bash
npm run compile:contracts
# or
cd examples/nextjs-art-investment && npm run compile
```

### Run Tests

```bash
npm test
# or
cd packages/fhevm-sdk && npm test
```

## 🌟 Key Innovations

1. **Universal Provider Pattern**: Single interface for all frameworks
2. **Smart Decryption**: Automatic fallback between user/public decrypt
3. **Fluent Builder API**: Chainable encryption input builder
4. **SSR-Safe Adapters**: Next.js compatibility out of the box
5. **Type-Safe Hooks**: Full TypeScript support for React
6. **Comprehensive Utils**: 40+ helper functions for common tasks
7. **Modular Design**: Import only what you need

## 📹 Video Demonstration

A complete walkthrough video demonstrating:

1. SDK installation and setup (< 10 lines)
2. Architecture overview
3. Next.js example walkthrough
4. Multi-framework support
5. Design decisions and best practices

**Video Guide**: [demo.md](./demo.md)

**Video File**: Download and watch `demo.mp4` from the repository. The video covers:
- Platform overview and features
- SDK installation process
- Next.js example demonstration
- React, Vue, and Node.js examples
- Technical architecture explanation
- Best practices and design patterns

*Note: The demo video must be downloaded to watch - direct links will not work.*

## 🔗 Deployed Examples

- **Next.js Art Investment**: [https://fhe-art-investment.vercel.app/](https://fhe-art-investment.vercel.app/)
- **GitHub Repository**: [https://github.com/GustHomenick/fhevm-react-template](https://github.com/GustHomenick/fhevm-react-template)

## 🤝 Contributing

This is a competition submission. Feedback and suggestions are welcome!

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- Built for the Zama FHEVM Bounty Program
- Based on official FHEVM documentation and SDK
- Inspired by wagmi's developer experience
- Smart contract example demonstrates real-world privacy use case

## 📞 Support

For issues or questions:

1. Check the [Setup Guide](./SETUP.md)
2. Review [SDK Documentation](./packages/fhevm-sdk/README.md)
3. See [Example README](./examples/nextjs-art-investment/README.md)
4. Review [Submission Details](./SUBMISSION.md)

---

**Built with ❤️ for confidential computing**

**Project Status**: ✅ Complete and Ready for Submission
**Submission Date**: October 2025
**Version**: 1.0.0

*Powered by Zama FHEVM • Example deployed on Vercel*
