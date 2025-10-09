# @fhevm/sdk

Universal FHEVM SDK for building confidential dApps with Fully Homomorphic Encryption.

## Features

- ✅ **Framework Agnostic** - Works with React, Vue, Next.js, Node.js, and vanilla JavaScript
- ✅ **Wagmi-like API** - Familiar, intuitive interface for Web3 developers
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Easy Integration** - Less than 10 lines of code to get started
- ✅ **Modular** - Import only what you need
- ✅ **Well Documented** - Clear examples and API reference

## Quick Start

### Installation

```bash
npm install @fhevm/sdk ethers
```

### Basic Usage (< 10 lines)

```typescript
import { createFHEVMClient, encryptValue } from '@fhevm/sdk';

// 1. Initialize client
const client = await createFHEVMClient({
  chainId: 8009,
  provider: 'https://devnet.zama.ai'
});

// 2. Encrypt a value
const encrypted = await encryptValue(client, 42, {
  contractAddress: '0x...',
  userAddress: '0x...'
});

// 3. Use in contract call
await contract.submitEncryptedValue(encrypted.data, encrypted.inputProof);
```

## Framework Integration

### React

```typescript
import { useFHEVM, useEncrypt, useDecrypt } from '@fhevm/sdk';

function MyComponent() {
  const { client, isReady } = useFHEVM(fhevmClient);
  const { encrypt } = useEncrypt(client, contractAddress, userAddress);
  const { decrypt } = useDecrypt(client, contractAddress, signer);

  // Use encrypt/decrypt in your component
}
```

### Next.js

```typescript
import { NextAdapter } from '@fhevm/sdk/adapters';

const adapter = new NextAdapter(config);
const client = await adapter.initializeClient(); // Client-side only
```

### Vue.js

```typescript
import { VueAdapter } from '@fhevm/sdk/adapters';

const adapter = new VueAdapter(config);
const client = adapter.getClient();
```

### Node.js

```typescript
import { createNodeAdapter } from '@fhevm/sdk/adapters';

const adapter = await createNodeAdapter(config);
const encrypted = await adapter.prepareEncryptedInput(value, contractAddress, userAddress);
```

## Core Concepts

### 1. Client Initialization

```typescript
import { createFHEVMClient } from '@fhevm/sdk';

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
```

### 2. Encryption

```typescript
import { encryptValue, createInputBuilder } from '@fhevm/sdk';

// Simple encryption
const encrypted = await encryptValue(client, 100, options);

// Multiple values with builder
const builder = createInputBuilder(client, options);
const encrypted = builder
  .add64(100)
  .addBool(true)
  .add32(42)
  .encrypt();
```

### 3. Decryption

```typescript
import { userDecrypt, publicDecrypt, smartDecrypt } from '@fhevm/sdk';

// User decrypt (with EIP-712 signature)
const result = await userDecrypt(client, handle, signer, contractAddress);

// Public decrypt (no signature needed)
const result = await publicDecrypt(client, handle, contractAddress);

// Smart decrypt (automatic fallback)
const result = await smartDecrypt(client, handle, contractAddress, signer);
```

### 4. Contract Integration

```typescript
import { ethers } from 'ethers';

const contract = new ethers.Contract(address, abi, signer);

// Encrypt value
const encrypted = await encryptValue(client, 100, {
  contractAddress: address,
  userAddress: await signer.getAddress()
});

// Call contract with encrypted input
const tx = await contract.submitValue(
  encrypted.data,
  encrypted.inputProof
);
await tx.wait();

// Decrypt result
const handle = await contract.getValue();
const decrypted = await userDecrypt(client, handle, signer, address);
```

## API Reference

### Core

- `createFHEVMClient(config)` - Create and initialize FHEVM client
- `FHEVMClient` - Main client class

### Encryption

- `encryptValue(client, value, options)` - Encrypt a single value
- `encryptBool(client, value, options)` - Encrypt a boolean
- `encryptArray(client, values, options)` - Encrypt multiple values
- `createInputBuilder(client, options)` - Create fluent input builder

### Decryption

- `userDecrypt(client, handle, signer, contractAddress)` - Decrypt with user signature
- `publicDecrypt(client, handle, contractAddress)` - Public decryption
- `smartDecrypt(client, handle, contractAddress, signer)` - Auto-select decryption method
- `batchUserDecrypt(client, handles, signer, contractAddress)` - Decrypt multiple values

### React Hooks

- `useFHEVM(client)` - Use FHEVM client
- `useEncrypt(client, contractAddress, userAddress)` - Encrypt values
- `useDecrypt(client, contractAddress, signer)` - Decrypt values
- `useEncryptedRead(client, contractAddress, handle, signer, config)` - Read encrypted state
- `useEncryptedWrite(client, contract, functionName, userAddress)` - Write encrypted data
- `useEncryptedEvent(contract, eventName, client, signer)` - Watch encrypted events

### Adapters

- `VueAdapter` - Vue.js integration
- `NextAdapter` - Next.js SSR-safe integration
- `NodeAdapter` - Node.js backend integration
- `createUniversalProvider()` - Framework-agnostic provider

### Utilities

- `formatHandle(handle)` - Format handle for display
- `isEncryptedHandle(value)` - Check if value is encrypted handle
- `shortenAddress(address)` - Shorten address for display
- `retry(fn, options)` - Retry with exponential backoff
- And more...

## Examples

See the `/examples` directory for complete examples:

- `examples/nextjs-art-investment` - Next.js art investment platform
- `examples/react-basic` - Basic React integration
- `examples/vue-app` - Vue.js application
- `examples/nodejs-cli` - Node.js CLI tool

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  FHEVMConfig,
  EncryptedInput,
  DecryptionResult,
  EncryptionOptions
} from '@fhevm/sdk';
```

## Best Practices

1. **Initialize Once** - Create client once and reuse
2. **Error Handling** - Always handle encryption/decryption errors
3. **Gas Optimization** - Batch operations when possible
4. **Security** - Validate addresses and inputs
5. **Testing** - Test with local FHEVM node first

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

MIT License - see LICENSE file for details

## Links

- [Documentation](https://docs.zama.ai)
- [GitHub](https://github.com/zama-ai/fhevm-react-template)
- [Discord](https://discord.gg/zama)

---

**Built with ❤️ for the FHEVM community**
