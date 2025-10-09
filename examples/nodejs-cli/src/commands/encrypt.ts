import ora from 'ora';
import { createNodeAdapter } from '@fhevm/sdk';

interface EncryptOptions {
  value?: string;
  contract?: string;
  user?: string;
}

export async function encryptCommand(options: EncryptOptions) {
  const spinner = ora('Initializing FHEVM...').start();

  try {
    // Get values from options or env
    const value = options.value || process.env.VALUE;
    const contractAddress = options.contract || process.env.CONTRACT_ADDRESS;
    const userAddress = options.user || process.env.USER_ADDRESS;

    if (!value || !contractAddress || !userAddress) {
      spinner.fail('Missing required parameters');
      console.log('\nUsage:');
      console.log('  fhevm-cli encrypt --value <value> --contract <address> --user <address>');
      console.log('\nOr set environment variables:');
      console.log('  VALUE=<value>');
      console.log('  CONTRACT_ADDRESS=<address>');
      console.log('  USER_ADDRESS=<address>');
      process.exit(1);
    }

    spinner.text = 'Creating FHEVM adapter...';

    // Create Node adapter
    const adapter = await createNodeAdapter({
      chainId: Number(process.env.CHAIN_ID || 11155111),
      provider: process.env.RPC_URL || '',
      debug: true,
    });

    spinner.text = 'Encrypting value...';

    // Encrypt the value
    const encrypted = await adapter.prepareEncryptedInput(
      BigInt(value),
      contractAddress,
      userAddress
    );

    spinner.succeed('Encryption successful!');

    console.log('\n📦 Encrypted Data:');
    console.log('─'.repeat(60));
    console.log(`Input Value: ${value}`);
    console.log(`Contract:    ${contractAddress}`);
    console.log(`User:        ${userAddress}`);
    console.log('\n🔒 Encrypted Output:');
    console.log(JSON.stringify(encrypted, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    , 2));
    console.log('─'.repeat(60));

  } catch (error: any) {
    spinner.fail('Encryption failed');
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}
