import ora from 'ora';
import { ethers } from 'ethers';

export async function infoCommand() {
  const spinner = ora('Fetching network information...').start();

  try {
    const chainId = process.env.CHAIN_ID || '11155111';
    const rpcUrl = process.env.RPC_URL;

    if (!rpcUrl) {
      spinner.fail('RPC_URL not configured');
      console.log('\nPlease set RPC_URL in your .env file');
      process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();

    spinner.succeed('Network information retrieved!');

    console.log('\n🌐 FHEVM Network Information:');
    console.log('─'.repeat(60));
    console.log(`Chain ID:      ${network.chainId.toString()}`);
    console.log(`Network Name:  ${network.name}`);
    console.log(`RPC URL:       ${rpcUrl}`);
    console.log(`Block Number:  ${blockNumber}`);
    console.log('─'.repeat(60));

    console.log('\n⚙️  Configuration:');
    console.log('─'.repeat(60));
    console.log(`CONTRACT_ADDRESS: ${process.env.CONTRACT_ADDRESS || 'Not set'}`);
    console.log(`USER_ADDRESS:     ${process.env.USER_ADDRESS || 'Not set'}`);
    console.log(`PRIVATE_KEY:      ${process.env.PRIVATE_KEY ? '***configured***' : 'Not set'}`);
    console.log('─'.repeat(60));

  } catch (error: any) {
    spinner.fail('Failed to fetch network information');
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}
