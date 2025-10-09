# Node.js CLI - FHEVM SDK Example

Command-line interface tool for FHEVM encryption and decryption operations.

## Features

- ✅ FHEVM SDK integration with Node.js Adapter
- ✅ CLI commands for encrypt/decrypt operations
- ✅ Interactive mode with prompts
- ✅ Environment variable configuration
- ✅ TypeScript support
- ✅ Beautiful terminal UI with ora and inquirer

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
CHAIN_ID=11155111
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=0x...
USER_ADDRESS=0x...
PRIVATE_KEY=your_private_key
```

### 3. Build the CLI

```bash
npm run build
```

## Usage

### Interactive Mode (Recommended)

```bash
npm run dev
# or
npm start
```

This launches an interactive menu where you can:
- Encrypt values
- Decrypt values
- View network information

### Command-Line Mode

#### Encrypt a Value

```bash
# Using command-line arguments
fhevm-cli encrypt --value 42 --contract 0x... --user 0x...

# Using environment variables
npm run encrypt
```

#### Decrypt a Value

```bash
# Using command-line arguments
fhevm-cli decrypt --handle 0x... --contract 0x... --private-key 0x...

# Using environment variables
npm run decrypt
```

#### Show Network Info

```bash
fhevm-cli info
```

### Development Mode

```bash
# Run without building
npm run dev

# Run specific command
tsx src/index.ts encrypt --value 100 --contract 0x... --user 0x...
```

## SDK Usage

This example demonstrates the Node.js Adapter pattern:

### 1. Node Adapter Initialization

```typescript
import { createNodeAdapter } from '@fhevm/sdk';

const adapter = await createNodeAdapter({
  chainId: 11155111,
  provider: 'https://sepolia.infura.io/v3/...',
  debug: true,
});
```

### 2. Encryption

```typescript
const encrypted = await adapter.prepareEncryptedInput(
  BigInt(value),
  contractAddress,
  userAddress
);

console.log('Encrypted:', encrypted);
```

### 3. Decryption

```typescript
import { createFHEVMClient, userDecrypt } from '@fhevm/sdk';
import { ethers } from 'ethers';

const client = await createFHEVMClient(config);
const signer = new ethers.Wallet(privateKey, provider);

const result = await userDecrypt(
  client,
  handle,
  signer,
  contractAddress
);

console.log('Decrypted:', result.value);
```

## Project Structure

```
nodejs-cli/
├── src/
│   ├── commands/
│   │   ├── encrypt.ts      # Encryption command
│   │   ├── decrypt.ts      # Decryption command
│   │   ├── info.ts         # Network info command
│   │   └── interactive.ts  # Interactive mode
│   └── index.ts            # CLI entry point
├── dist/                   # Compiled output
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
└── README.md               # This file
```

## Available Commands

### CLI Commands

```bash
fhevm-cli encrypt [options]    # Encrypt a value
fhevm-cli decrypt [options]    # Decrypt a value
fhevm-cli info                 # Show network info
fhevm-cli interactive          # Interactive mode
fhevm-cli --help               # Show help
```

### NPM Scripts

```bash
npm run build      # Compile TypeScript
npm start          # Run compiled CLI
npm run dev        # Run with tsx (no build)
npm run encrypt    # Quick encrypt with env vars
npm run decrypt    # Quick decrypt with env vars
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

The SDK provides Node.js-specific features:
- `createNodeAdapter` - Node.js adapter for backend
- `prepareEncryptedInput` - Prepare encrypted data
- `createFHEVMClient` - Initialize FHEVM client
- `userDecrypt` - Decrypt with EIP-712 signature

## Key Features

### Node.js Adapter

The NodeAdapter provides backend-focused integration:

```typescript
import { createNodeAdapter } from '@fhevm/sdk';

const adapter = await createNodeAdapter(config);
const encrypted = await adapter.prepareEncryptedInput(
  value,
  contractAddress,
  userAddress
);
```

### CLI with Commander

Uses commander for argument parsing:

```typescript
import { Command } from 'commander';

program
  .command('encrypt')
  .option('-v, --value <value>', 'Value to encrypt')
  .action(encryptCommand);
```

### Interactive Mode with Inquirer

Beautiful prompts for user input:

```typescript
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'value',
    message: 'Enter value:',
  },
]);
```

### Loading Indicators with Ora

Spinners for long operations:

```typescript
import ora from 'ora';

const spinner = ora('Encrypting...').start();
// ... operation ...
spinner.succeed('Success!');
```

## Examples

### Example 1: Encrypt a value

```bash
$ fhevm-cli encrypt --value 42 --contract 0x742d... --user 0x1234...

✔ Encryption successful!

📦 Encrypted Data:
────────────────────────────────────────────────────────
Input Value: 42
Contract:    0x742d...
User:        0x1234...

🔒 Encrypted Output:
{
  "data": "0x...",
  "inputProof": "0x..."
}
────────────────────────────────────────────────────────
```

### Example 2: Interactive Mode

```bash
$ fhevm-cli interactive

🚀 FHEVM CLI - Interactive Mode

? What would you like to do? 🔒 Encrypt a value
? Enter the value to encrypt: 42
? Enter contract address: 0x742d...
? Enter user address: 0x1234...

✔ Encryption successful!
```

## Environment Variables

Required:
- `CHAIN_ID` - Network chain ID (e.g., 11155111 for Sepolia)
- `RPC_URL` - JSON-RPC endpoint URL
- `CONTRACT_ADDRESS` - Smart contract address
- `USER_ADDRESS` - User wallet address
- `PRIVATE_KEY` - Private key for signing (decrypt only)

Optional:
- `VALUE` - Default value for encryption
- `ENCRYPTED_HANDLE` - Default handle for decryption

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Main Project README](../../README.md)
- [Setup Guide](../../SETUP.md)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)

## License

MIT
