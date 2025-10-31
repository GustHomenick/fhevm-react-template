import ora from 'ora';
import { ethers } from 'ethers';
import { createFHEVMClient, userDecrypt } from '@fhevm/sdk';

interface DecryptOptions {
  handle?: string;
  contract?: string;
  privateKey?: string;
}

export async function decryptCommand(options: DecryptOptions) {
  const spinner = ora('Initializing FHEVM...').start();

  try {
    // Get values from options or env
    const handle = options.handle || process.env.ENCRYPTED_HANDLE;
    const contractAddress = options.contract || process.env.CONTRACT_ADDRESS;
    const privateKey = options.privateKey || process.env.PRIVATE_KEY;

    if (!handle || !contractAddress || !privateKey) {
      spinner.fail('Missing required parameters');
      console.log('\nUsage:');
      console.log('  fhevm-cli decrypt --handle <handle> --contract <address> --private-key <key>');
      console.log('\nOr set environment variables:');
      console.log('  ENCRYPTED_HANDLE=<handle>');
      console.log('  CONTRACT_ADDRESS=<address>');
      console.log('  PRIVATE_KEY=<key>');
      process.exit(1);
    }

    spinner.text = 'Creating FHEVM client...';

    // Create FHEVM client
    const client = await createFHEVMClient({
      chainId: Number(process.env.CHAIN_ID || 11155111),
      provider: process.env.RPC_URL || '',
      debug: true,
    });

    spinner.text = 'Setting up signer...';

    // Create signer from private key
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);

    spinner.text = 'Decrypting value (signing with EIP-712)...';

    // Decrypt the value
    const result = await userDecrypt(
      client,
      handle,
      signer,
      contractAddress
    );

    spinner.succeed('Decryption successful!');

    console.log('\n🔓 Decrypted Data:');
    console.log('─'.repeat(60));
    console.log(`Handle:   ${handle}`);
    console.log(`Contract: ${contractAddress}`);
    console.log(`Signer:   ${await signer.getAddress()}`);
    console.log('\n✨ Decrypted Value:');
    console.log(`  ${result.value.toString()}`);
    console.log('─'.repeat(60));

  } catch (error: any) {
    spinner.fail('Decryption failed');
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}
