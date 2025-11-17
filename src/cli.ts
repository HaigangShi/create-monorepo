#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { createMonorepo, CreateOptions } from './commands/create';
import { PluginOptions } from './commands/plugin';
import { validateNodeVersion } from './utils/validation';
import { version } from '../package.json';

async function main() {
  try {
    // Validate Node.js version
    validateNodeVersion();

    program
      .name('create-monorepo')
      .description(
        'A CLI tool for quickly initializing and managing containerized monorepo development environments'
      )
      .version(version, '-v, --version', 'output the current version')
      .helpOption('-h, --help', 'display help for command');

    // Default command: allow `create-monorepo <project-name>` without explicit subcommand
    program
      .argument('[project-name]')
      .option('-t, --template <template>', 'project template to use', 'default')
      .option('-p, --package-manager <pm>', 'package manager to use (npm, yarn, pnpm)', 'pnpm')
      .option('--docker', 'include Docker configuration', false)
      .option('--skip-install', 'skip dependency installation', false)
      .option('--skip-git', 'skip git initialization', false)
      .option('--interactive', 'use interactive mode', false)
      .action((projectName: string | undefined, options: CreateOptions) =>
        createMonorepo(projectName, options)
      );

    // Create command
    program
      .command('create [project-name]')
      .description('Create a new monorepo project')
      .option('-t, --template <template>', 'project template to use', 'default')
      .option('-p, --package-manager <pm>', 'package manager to use (npm, yarn, pnpm)', 'pnpm')
      .option('--docker', 'include Docker configuration', false)
      .option('--skip-install', 'skip dependency installation', false)
      .option('--skip-git', 'skip git initialization', false)
      .option('--interactive', 'use interactive mode', false)
      .action((projectName: string | undefined, options: CreateOptions) =>
        createMonorepo(projectName, options)
      );

    // Plugin command
    program
      .command('plugin')
      .description('Manage plugins')
      .option('-l, --list', 'list available plugins')
      .option('-i, --install <plugin>', 'install a plugin')
      .option('-u, --uninstall <plugin>', 'uninstall a plugin')
      .action(async (options: PluginOptions) => {
        const { managePlugins } = await import('./commands/plugin');
        await managePlugins(options);
      });

    // Doctor command for diagnostics
    program
      .command('doctor')
      .description('Run diagnostics on your monorepo setup')
      .action(async () => {
        const { runDoctor } = await import('./commands/doctor');
        await runDoctor();
      });

    // Parse command line arguments
    await program.parseAsync(process.argv);

    if (process.argv.length === 2) {
      console.log(program.helpInformation());
      throw new Error('NoArguments');
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error(chalk.red('Uncaught Exception:'), error instanceof Error ? error.message : error);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  console.error(
    chalk.red('Unhandled Rejection:'),
    reason instanceof Error ? reason.message : reason
  );
  process.exit(1);
});

main().catch(error => {
  console.error(chalk.red('Fatal Error:'), error instanceof Error ? error.message : error);
  process.exit(1);
});
