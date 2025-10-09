import inquirer from 'inquirer';
import { encryptCommand } from './encrypt.js';
import { decryptCommand } from './decrypt.js';
import { infoCommand } from './info.js';

export async function interactiveCommand() {
  console.log('\n🚀 FHEVM CLI - Interactive Mode\n');

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🔒 Encrypt a value', value: 'encrypt' },
        { name: '🔓 Decrypt a value', value: 'decrypt' },
        { name: 'ℹ️  Show network info', value: 'info' },
        { name: '❌ Exit', value: 'exit' },
      ],
    },
  ]);

  if (action === 'exit') {
    console.log('\n👋 Goodbye!\n');
    process.exit(0);
  }

  if (action === 'info') {
    await infoCommand();
    return;
  }

  if (action === 'encrypt') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: 'Enter the value to encrypt:',
        validate: (input) => {
          if (!input) return 'Value is required';
          if (isNaN(Number(input))) return 'Value must be a number';
          return true;
        },
      },
      {
        type: 'input',
        name: 'contract',
        message: 'Enter contract address:',
        default: process.env.CONTRACT_ADDRESS || '',
        validate: (input) => {
          if (!input) return 'Contract address is required';
          if (!/^0x[a-fA-F0-9]{40}$/.test(input)) {
            return 'Invalid Ethereum address';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'user',
        message: 'Enter user address:',
        default: process.env.USER_ADDRESS || '',
        validate: (input) => {
          if (!input) return 'User address is required';
          if (!/^0x[a-fA-F0-9]{40}$/.test(input)) {
            return 'Invalid Ethereum address';
          }
          return true;
        },
      },
    ]);

    await encryptCommand(answers);
  }

  if (action === 'decrypt') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'handle',
        message: 'Enter encrypted handle:',
        validate: (input) => {
          if (!input) return 'Handle is required';
          return true;
        },
      },
      {
        type: 'input',
        name: 'contract',
        message: 'Enter contract address:',
        default: process.env.CONTRACT_ADDRESS || '',
        validate: (input) => {
          if (!input) return 'Contract address is required';
          if (!/^0x[a-fA-F0-9]{40}$/.test(input)) {
            return 'Invalid Ethereum address';
          }
          return true;
        },
      },
      {
        type: 'password',
        name: 'privateKey',
        message: 'Enter private key:',
        default: process.env.PRIVATE_KEY || '',
        mask: '*',
        validate: (input) => {
          if (!input) return 'Private key is required';
          return true;
        },
      },
    ]);

    await decryptCommand(answers);
  }

  // Ask if user wants to continue
  const { continue: shouldContinue } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: '\nPerform another action?',
      default: true,
    },
  ]);

  if (shouldContinue) {
    await interactiveCommand();
  } else {
    console.log('\n👋 Goodbye!\n');
  }
}
