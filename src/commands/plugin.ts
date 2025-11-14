import chalk from 'chalk';
import ora from 'ora';
import { Plugin } from '../types';
import { fileExists, readFile, writeFile } from '../utils/file-system';

interface PluginOptions {
  list?: boolean;
  install?: string;
  uninstall?: string;
}

const AVAILABLE_PLUGINS: Plugin[] = [
  {
    name: 'storybook',
    version: '1.0.0',
    description: 'Storybook for component development',
    install: async (config) => {
      console.log(chalk.blue('📚 Installing Storybook...'));
      // Implementation for installing Storybook
    },
    uninstall: async (config) => {
      console.log(chalk.blue('📚 Uninstalling Storybook...'));
      // Implementation for uninstalling Storybook
    },
  },
  {
    name: 'playwright',
    version: '1.0.0',
    description: 'Playwright for end-to-end testing',
    install: async (config) => {
      console.log(chalk.blue('🎭 Installing Playwright...'));
      // Implementation for installing Playwright
    },
    uninstall: async (config) => {
      console.log(chalk.blue('🎭 Uninstalling Playwright...'));
      // Implementation for uninstalling Playwright
    },
  },
  {
    name: 'cypress',
    version: '1.0.0',
    description: 'Cypress for end-to-end testing',
    install: async (config) => {
      console.log(chalk.blue('🌲 Installing Cypress...'));
      // Implementation for installing Cypress
    },
    uninstall: async (config) => {
      console.log(chalk.blue('🌲 Uninstalling Cypress...'));
      // Implementation for uninstalling Cypress
    },
  },
  {
    name: 'jest',
    version: '1.0.0',
    description: 'Jest testing framework',
    install: async (config) => {
      console.log(chalk.blue('🃏 Installing Jest...'));
      // Implementation for installing Jest
    },
    uninstall: async (config) => {
      console.log(chalk.blue('🃏 Uninstalling Jest...'));
      // Implementation for uninstalling Jest
    },
  },
  {
    name: 'prisma',
    version: '1.0.0',
    description: 'Prisma ORM for database management',
    install: async (config) => {
      console.log(chalk.blue('🗄️ Installing Prisma...'));
      // Implementation for installing Prisma
    },
    uninstall: async (config) => {
      console.log(chalk.blue('🗄️ Uninstalling Prisma...'));
      // Implementation for uninstalling Prisma
    },
  },
  {
    name: 'supabase',
    version: '1.0.0',
    description: 'Supabase for backend services',
    install: async (config) => {
      console.log(chalk.blue('🚀 Installing Supabase...'));
      // Implementation for installing Supabase
    },
    uninstall: async (config) => {
      console.log(chalk.blue('🚀 Uninstalling Supabase...'));
      // Implementation for uninstalling Supabase
    },
  },
  {
    name: 'stripe',
    version: '1.0.0',
    description: 'Stripe for payment processing',
    install: async (config) => {
      console.log(chalk.blue('💳 Installing Stripe...'));
      // Implementation for installing Stripe
    },
    uninstall: async (config) => {
      console.log(chalk.blue('💳 Uninstalling Stripe...'));
      // Implementation for uninstalling Stripe
    },
  },
];

export async function managePlugins(options: PluginOptions): Promise<void> {
  try {
    if (options.list) {
      await listPlugins();
    } else if (options.install) {
      await installPlugin(options.install);
    } else if (options.uninstall) {
      await uninstallPlugin(options.uninstall);
    } else {
      console.log(chalk.yellow('Please specify an action: --list, --install, or --uninstall'));
      await listPlugins();
    }
  } catch (error) {
    console.error(chalk.red('❌ Plugin management failed:'));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function listPlugins(): Promise<void> {
  console.log(chalk.blue('\n📦 Available Plugins:\n'));
  
  AVAILABLE_PLUGINS.forEach((plugin) => {
    console.log(chalk.cyan(`  ${plugin.name}`));
    console.log(chalk.gray(`    ${plugin.description}`));
    console.log(chalk.gray(`    Version: ${plugin.version}`));
    console.log();
  });

  console.log(chalk.gray('Use --install <plugin-name> to install a plugin'));
  console.log(chalk.gray('Use --uninstall <plugin-name> to remove a plugin\n'));
}

async function installPlugin(pluginName: string): Promise<void> {
  const plugin = AVAILABLE_PLUGINS.find(p => p.name === pluginName);
  
  if (!plugin) {
    console.error(chalk.red(`❌ Plugin "${pluginName}" not found`));
    console.log(chalk.yellow('Available plugins:'));
    AVAILABLE_PLUGINS.forEach(p => console.log(chalk.gray(`  - ${p.name}`)));
    process.exit(1);
  }

  const spinner = ora(`Installing ${plugin.name}...`).start();

  try {
    // Check if we're in a monorepo project
    const packageJsonPath = './package.json';
    const pnpmWorkspacePath = './pnpm-workspace.yaml';
    
    if (!(await fileExists(packageJsonPath)) || !(await fileExists(pnpmWorkspacePath))) {
      throw new Error('Not in a monorepo project directory. Please run this command from your monorepo root.');
    }

    // Read current configuration
    const packageJson = JSON.parse(await readFile(packageJsonPath));
    
    // Install the plugin
    await plugin.install(packageJson);
    
    spinner.succeed(chalk.green(`✅ Plugin "${plugin.name}" installed successfully`));
    
    console.log(chalk.cyan('\n📋 Next steps:'));
    console.log(chalk.white(`  - Review the configuration files created by ${plugin.name}`));
    console.log(chalk.white(`  - Update your environment variables if needed`));
    console.log(chalk.white(`  - Run "pnpm install" to install new dependencies`));
    console.log(chalk.white(`  - Check the documentation for ${plugin.name} setup instructions`));
    
  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to install plugin "${plugin.name}"`));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function uninstallPlugin(pluginName: string): Promise<void> {
  const plugin = AVAILABLE_PLUGINS.find(p => p.name === pluginName);
  
  if (!plugin) {
    console.error(chalk.red(`❌ Plugin "${pluginName}" not found`));
    console.log(chalk.yellow('Available plugins:'));
    AVAILABLE_PLUGINS.forEach(p => console.log(chalk.gray(`  - ${p.name}`)));
    process.exit(1);
  }

  const spinner = ora(`Uninstalling ${plugin.name}...`).start();

  try {
    // Check if we're in a monorepo project
    const packageJsonPath = './package.json';
    const pnpmWorkspacePath = './pnpm-workspace.yaml';
    
    if (!(await fileExists(packageJsonPath)) || !(await fileExists(pnpmWorkspacePath))) {
      throw new Error('Not in a monorepo project directory. Please run this command from your monorepo root.');
    }

    // Read current configuration
    const packageJson = JSON.parse(await readFile(packageJsonPath));
    
    // Uninstall the plugin
    await plugin.uninstall(packageJson);
    
    spinner.succeed(chalk.green(`✅ Plugin "${plugin.name}" uninstalled successfully`));
    
    console.log(chalk.cyan('\n📋 Next steps:'));
    console.log(chalk.white(`  - Remove any remaining configuration files`));
    console.log(chalk.white(`  - Update your environment variables`));
    console.log(chalk.white(`  - Run "pnpm install" to clean up dependencies`));
    
  } catch (error) {
    spinner.fail(chalk.red(`❌ Failed to uninstall plugin "${plugin.name}"`));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Plugin installation implementations
export async function installStorybook(config: any): Promise<void> {
  // Add Storybook dependencies to root package.json
  config.devDependencies = config.devDependencies || {};
  config.devDependencies['@storybook/react'] = '^7.0.0';
  config.devDependencies['@storybook/addon-essentials'] = '^7.0.0';
  config.devDependencies['@storybook/addon-interactions'] = '^7.0.0';
  config.devDependencies['@storybook/testing-library'] = '^0.2.0';
  
  // Add Storybook scripts
  config.scripts = config.scripts || {};
  config.scripts['storybook'] = 'storybook dev -p 6006';
  config.scripts['build-storybook'] = 'storybook build';
  
  // Write updated package.json
  await writeFile('./package.json', JSON.stringify(config, null, 2));
  
  // Create Storybook configuration
  const storybookConfig = `import type { StorybookConfig } from '@storybook/react';

const config: StorybookConfig = {
  stories: ['../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;`;
  
  await writeFile('.storybook/main.ts', storybookConfig);
}

export async function installPlaywright(config: any): Promise<void> {
  // Add Playwright dependencies
  config.devDependencies = config.devDependencies || {};
  config.devDependencies['@playwright/test'] = '^1.40.0';
  
  // Add Playwright scripts
  config.scripts = config.scripts || {};
  config.scripts['test:e2e'] = 'playwright test';
  config.scripts['test:e2e:ui'] = 'playwright test --ui';
  config.scripts['test:e2e:report'] = 'playwright show-report';
  
  // Write updated package.json
  await writeFile('./package.json', JSON.stringify(config, null, 2));
  
  // Create Playwright configuration
  const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`;
  
  await writeFile('playwright.config.ts', playwrightConfig);
}