import { execa } from 'execa';
import chalk from 'chalk';
import { MonorepoConfig } from '../types';

export async function installDependencies(
  projectPath: string,
  packageManager: 'npm' | 'yarn' | 'pnpm'
): Promise<void> {
  try {
    console.log(chalk.blue(`📦 Installing dependencies with ${packageManager}...`));
    
    let command: string;
    let args: string[];
    
    switch (packageManager) {
      case 'npm':
        command = 'npm';
        args = ['install'];
        break;
      case 'yarn':
        command = 'yarn';
        args = ['install'];
        break;
      case 'pnpm':
        command = 'pnpm';
        args = ['install'];
        break;
      default:
        throw new Error(`Unsupported package manager: ${packageManager}`);
    }
    
    await execa(command, args, {
      cwd: projectPath,
      stdio: 'inherit',
    });
    
    console.log(chalk.green('✅ Dependencies installed successfully'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to install dependencies:'));
    console.error(error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function checkPackageManagerInstalled(packageManager: 'npm' | 'yarn' | 'pnpm'): Promise<boolean> {
  try {
    await execa(packageManager, ['--version']);
    return true;
  } catch {
    return false;
  }
}

export function getPackageManagerInstallCommand(packageManager: 'npm' | 'yarn' | 'pnpm'): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'yarn':
      return 'yarn install';
    case 'pnpm':
      return 'pnpm install';
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}

export function getPackageManagerAddCommand(packageManager: 'npm' | 'yarn' | 'pnpm'): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'yarn':
      return 'yarn add';
    case 'pnpm':
      return 'pnpm add';
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}

export function getPackageManagerDevAddCommand(packageManager: 'npm' | 'yarn' | 'pnpm'): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install -D';
    case 'yarn':
      return 'yarn add -D';
    case 'pnpm':
      return 'pnpm add -D';
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}