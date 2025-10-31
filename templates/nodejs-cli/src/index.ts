#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { encryptCommand } from './commands/encrypt.js';
import { decryptCommand } from './commands/decrypt.js';
import { infoCommand } from './commands/info.js';
import { interactiveCommand } from './commands/interactive.js';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('fhevm-cli')
  .description('CLI tool for FHEVM encryption and decryption')
  .version('1.0.0');

// Encrypt command
program
  .command('encrypt')
  .description('Encrypt a value using FHEVM')
  .option('-v, --value <value>', 'Value to encrypt')
  .option('-c, --contract <address>', 'Contract address')
  .option('-u, --user <address>', 'User address')
  .action(encryptCommand);

// Decrypt command
program
  .command('decrypt')
  .description('Decrypt an encrypted value using FHEVM')
  .option('-h, --handle <handle>', 'Encrypted handle')
  .option('-c, --contract <address>', 'Contract address')
  .option('-k, --private-key <key>', 'Private key for signing')
  .action(decryptCommand);

// Info command
program
  .command('info')
  .description('Show FHEVM network information')
  .action(infoCommand);

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Interactive mode with prompts')
  .action(interactiveCommand);

program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
