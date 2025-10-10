# Vue.js - FHEVM SDK Example

Vue 3 application demonstrating FHEVM SDK integration using Composition API.

## Features

- ✅ FHEVM SDK integration with Vue Adapter
- ✅ Vue 3 Composition API
- ✅ Wallet connection with Wagmi Vue
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
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

## SDK Usage

This example demonstrates the Vue Adapter pattern:

### 1. Vue Adapter Initialization

```typescript
import { VueAdapter } from '@fhevm/sdk';

const adapter = new VueAdapter({
  chainId: 11155111,
  provider: 'https://sepolia.infura.io/v3/...',
  debug: true,
});

const client = adapter.getClient();
```

### 2. Encryption in Vue Component

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { encryptValue, type FHEVMClient } from '@fhevm/sdk';

const props = defineProps<{
  fhevmClient: FHEVMClient;
  userAddress: string;
}>();

const value = ref('');

async function handleEncrypt() {
  const encrypted = await encryptValue(
    props.fhevmClient,
    BigInt(value.value),
    {
      contractAddress: '0x...',
      userAddress: props.userAddress,
    }
  );
  // Use encrypted data
}
</script>
```

### 3. Reactive State Management

```typescript
import { ref, watch } from 'vue';

const fhevmClient = ref<FHEVMClient | null>(null);

watch(isConnected, (connected) => {
  if (connected) {
    initFHEVM();
  }
});
```

## Project Structure

```
vue-app/
├── src/
│   ├── components/
│   │   └── DemoSection.vue    # Encryption demo component
│   ├── App.vue                # Main app with FHEVM integration
│   ├── main.ts                # Entry point with Wagmi setup
│   └── style.css              # Global styles
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
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

The SDK provides Vue-specific features:
- `VueAdapter` - Vue 3 Composition API adapter
- `encryptValue` - Encryption function
- `userDecrypt` - Decryption with EIP-712
- All core SDK functionality

## Key Features

### Vue Adapter Pattern

The VueAdapter provides a clean integration with Vue 3:

```typescript
import { VueAdapter } from '@fhevm/sdk';

const adapter = new VueAdapter(config);
const client = adapter.getClient();
```

### Reactive State

Use Vue's reactive system with FHEVM:

```typescript
const fhevmClient = ref<FHEVMClient | null>(null);
const isEncrypting = ref(false);
const encryptedValue = ref('');
```

### Component Props

Pass FHEVM client through props:

```vue
<DemoSection
  :fhevmClient="fhevmClient"
  :userAddress="address"
/>
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Vue 3 Documentation](https://vuejs.org/)
- [Main Project README](../../README.md)
- [Setup Guide](../../SETUP.md)

## License

MIT
