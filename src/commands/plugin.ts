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
      console.log('📚 Installing Storybook...');
    },
    uninstall: async (config) => {
      console.log('📚 Uninstalling Storybook...');
    },
  },
  {
    name: 'playwright',
    version: '1.0.0',
    description: 'Playwright for end-to-end testing',
    install: async (config) => {
      console.log('🎭 Installing Playwright...');
    },
    uninstall: async (config) => {
      console.log('🎭 Uninstalling Playwright...');
    },
  },
  {
    name: 'cypress',
    version: '1.0.0',
    description: 'Cypress for end-to-end testing',
    install: async (config) => {
      console.log('🌲 Installing Cypress...');
    },
    uninstall: async (config) => {
      console.log('🌲 Uninstalling Cypress...');
    },
  },
  {
    name: 'jest',
    version: '1.0.0',
    description: 'Jest testing framework',
    install: async (config) => {
      console.log('🃏 Installing Jest...');
    },
    uninstall: async (config) => {
      console.log('🃏 Uninstalling Jest...');
    },
  },
  {
    name: 'prisma',
    version: '1.0.0',
    description: 'Prisma ORM for database management',
    install: async (config) => {
      console.log('🗄️ Installing Prisma...');
    },
    uninstall: async (config) => {
      console.log('🗄️ Uninstalling Prisma...');
    },
  },
  {
    name: 'supabase',
    version: '1.0.0',
    description: 'Supabase for backend services',
    install: async (config) => {
      console.log('🚀 Installing Supabase...');
    },
    uninstall: async (config) => {
      console.log('🚀 Uninstalling Supabase...');
    },
  },
  {
    name: 'stripe',
    version: '1.0.0',
    description: 'Stripe for payment processing',
    install: async (config) => {
      console.log('💳 Installing Stripe...');
    },
    uninstall: async (config) => {
      console.log('💳 Uninstalling Stripe...');
    },
  },
];

export async function managePlugins(options: PluginOptions): Promise<void> {
  if (options.list) {
    await listPlugins();
  } else if (options.install) {
    await installPlugin(options.install);
  } else if (options.uninstall) {
    await uninstallPlugin(options.uninstall);
  } else {
    console.log('Please specify an action: --list, --install, or --uninstall');
    await listPlugins();
  }
}

async function listPlugins(): Promise<void> {
  console.log('\n📦 Available Plugins:\n');
  
  AVAILABLE_PLUGINS.forEach((plugin) => {
    console.log(`  ${plugin.name}`);
    console.log(`    ${plugin.description}`);
    console.log(`    Version: ${plugin.version}`);
    console.log();
  });

  console.log('Use --install <plugin-name> to install a plugin');
  console.log('Use --uninstall <plugin-name> to remove a plugin\n');
}

async function installPlugin(pluginName: string): Promise<void> {
  const plugin = AVAILABLE_PLUGINS.find(p => p.name === pluginName);
  
  if (!plugin) {
    console.error(`❌ Plugin "${pluginName}" not found`);
    console.log('Available plugins:');
    AVAILABLE_PLUGINS.forEach(p => console.log(`  - ${p.name}`));
    if (process.env.NODE_ENV === 'test') {
      throw new Error('Process.exit');
    }
    process.exit(1);
  }

  console.log(`Installing ${plugin.name}...`);

  // Check if we're in a monorepo project
  const packageJsonPath = './package.json';
  const pnpmWorkspacePath = './pnpm-workspace.yaml';
  if (!(await fileExists(packageJsonPath)) || !(await fileExists(pnpmWorkspacePath))) {
    console.error('Not in a monorepo project directory. Please run this command from your monorepo root.');
    if (process.env.NODE_ENV === 'test') {
      throw new Error('Process.exit');
    }
    process.exit(1);
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath));
  if (plugin.name === 'storybook') {
    await installStorybook(packageJson);
  } else if (plugin.name === 'playwright') {
    await installPlaywright(packageJson);
  } else {
    await plugin.install(packageJson);
    await writeFile('./package.json', JSON.stringify(packageJson, null, 2));
  }
  
  console.log(`✅ Plugin "${plugin.name}" installed successfully`);
  
  console.log('\n📋 Next steps:');
  console.log(`  - Review the configuration files created by ${plugin.name}`);
  console.log(`  - Update your environment variables if needed`);
  console.log(`  - Run "pnpm install" to install new dependencies`);
  console.log(`  - Check the documentation for ${plugin.name} setup instructions`);
}

async function uninstallPlugin(pluginName: string): Promise<void> {
  const plugin = AVAILABLE_PLUGINS.find(p => p.name === pluginName);
  
  if (!plugin) {
    console.error(`❌ Plugin "${pluginName}" not found`);
    console.log('Available plugins:');
    AVAILABLE_PLUGINS.forEach(p => console.log(`  - ${p.name}`));
    if (process.env.NODE_ENV === 'test') {
      throw new Error('Process.exit');
    }
    process.exit(1);
  }

  console.log(`Uninstalling ${plugin.name}...`);

  // Check if we're in a monorepo project
  const packageJsonPath = './package.json';
  const pnpmWorkspacePath = './pnpm-workspace.yaml';
  if (!(await fileExists(packageJsonPath)) || !(await fileExists(pnpmWorkspacePath))) {
    console.error('Not in a monorepo project directory. Please run this command from your monorepo root.');
    if (process.env.NODE_ENV === 'test') {
      throw new Error('Process.exit');
    }
    process.exit(1);
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath));
  await plugin.uninstall(packageJson);
  await writeFile('./package.json', JSON.stringify(packageJson, null, 2));
  
  console.log(`✅ Plugin "${plugin.name}" uninstalled successfully`);
  
  console.log('\n📋 Next steps:');
  console.log(`  - Remove any remaining configuration files`);
  console.log(`  - Update your environment variables`);
  console.log(`  - Run "pnpm install" to clean up dependencies`);
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