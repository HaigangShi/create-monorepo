import inquirer from 'inquirer';
import chalk from 'chalk';
import { MonorepoConfig, AppConfig, PackageConfig, ServiceConfig } from '../types';
import { validateProjectName, sanitizeProjectName } from './validation';

export async function promptForProjectName(defaultName?: string): Promise<string> {
  const { projectName } = await inquirer.prompt<{ projectName: string }>([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: defaultName || 'my-monorepo',
      validate: (input: string): string | boolean => {
        const sanitized = sanitizeProjectName(input);
        const validation = validateProjectName(sanitized);

        if (!validation.valid) {
          return `Invalid project name: ${validation.errors.join(', ')}`;
        }

        return true;
      },
      filter: (input: string) => sanitizeProjectName(input),
    },
  ]);

  return projectName;
}

export async function promptForPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  const { packageManager } = await inquirer.prompt<{ packageManager: 'npm' | 'yarn' | 'pnpm' }>([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: [
        { name: 'pnpm (recommended for monorepos)', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'npm', value: 'npm' },
      ],
      default: 'pnpm',
    },
  ]);

  return packageManager;
}

export async function promptForTemplate(): Promise<string> {
  const { template } = await inquirer.prompt<{ template: string }>([
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { name: 'Default - Full-featured monorepo', value: 'default' },
        { name: 'Next.js Fullstack - Next.js + Services', value: 'next-fullstack' },
        { name: 'Vue Fullstack - Vue.js + Services', value: 'vue-fullstack' },
        { name: 'React Fullstack - React + Services', value: 'react-fullstack' },
        { name: 'Minimal - Basic structure only', value: 'minimal' },
        { name: 'Enterprise - Complete enterprise setup', value: 'enterprise' },
      ],
      default: 'default',
    },
  ]);

  return template;
}

export async function promptForDocker(): Promise<boolean> {
  const { docker } = await inquirer.prompt<{ docker: boolean }>([
    {
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker configuration for containerized development?',
      default: true,
    },
  ]);

  return docker;
}

export async function promptForApps(): Promise<AppConfig[]> {
  const { addApps } = await inquirer.prompt<{ addApps: boolean }>([
    {
      type: 'confirm',
      name: 'addApps',
      message: 'Would you like to add applications to your monorepo?',
      default: true,
    },
  ]);

  if (!addApps) {
    return [];
  }

  const apps: AppConfig[] = [];
  let addMore = true;

  while (addMore) {
    const appConfig = await promptForSingleApp();
    apps.push(appConfig);

    const { continueAdding } = await inquirer.prompt<{ continueAdding: boolean }>([
      {
        type: 'confirm',
        name: 'continueAdding',
        message: 'Would you like to add another application?',
        default: false,
      },
    ]);

    addMore = continueAdding;
  }

  return apps;
}

async function promptForSingleApp(): Promise<AppConfig> {
  const answers = await inquirer.prompt<{
    name: string;
    type: 'next' | 'vue' | 'react' | 'svelte';
    port: number;
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'Application name:',
      validate: (input: string): string | boolean => {
        if (!input.trim()) {
          return 'Application name is required';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'type',
      message: 'Application type:',
      choices: [
        { name: 'Next.js', value: 'next' },
        { name: 'Vue.js', value: 'vue' },
        { name: 'React', value: 'react' },
        { name: 'Svelte', value: 'svelte' },
      ],
    },
    {
      type: 'number',
      name: 'port',
      message: 'Development port:',
      default: 3000,
      validate: (input: number): string | boolean => {
        if (input < 1024 || input > 65535) {
          return 'Port must be between 1024 and 65535';
        }
        return true;
      },
    },
  ]);

  return {
    name: answers.name,
    type: answers.type,
    port: answers.port,
    features: [],
  };
}

export async function promptForPackages(): Promise<PackageConfig[]> {
  const { addPackages } = await inquirer.prompt<{ addPackages: boolean }>([
    {
      type: 'confirm',
      name: 'addPackages',
      message: 'Would you like to add shared packages?',
      default: true,
    },
  ]);

  if (!addPackages) {
    return [];
  }

  const { packages } = await inquirer.prompt<{ packages: string[] }>([
    {
      type: 'checkbox',
      name: 'packages',
      message: 'Select shared packages to include:',
      choices: [
        { name: 'UI Components (React/Vue)', value: 'ui' },
        { name: 'Utility Functions', value: 'utils' },
        { name: 'TypeScript Types', value: 'types' },
        { name: 'React Hooks', value: 'hooks' },
        { name: 'Vue Composables', value: 'composables' },
        { name: 'API Client', value: 'api-client' },
        { name: 'Database Layer', value: 'database' },
        { name: 'Configuration', value: 'config' },
      ],
    },
  ]);

  return packages.map((pkg: string) => ({
    name: pkg,
    type: pkg as PackageConfig['type'],
    shared: true,
  }));
}

export async function promptForServices(): Promise<ServiceConfig[]> {
  const { addServices } = await inquirer.prompt<{ addServices: boolean }>([
    {
      type: 'confirm',
      name: 'addServices',
      message: 'Would you like to add backend services?',
      default: true,
    },
  ]);

  if (!addServices) {
    return [];
  }

  const { services } = await inquirer.prompt<{ services: string[] }>([
    {
      type: 'checkbox',
      name: 'services',
      message: 'Select backend services to include:',
      choices: [
        { name: 'API Gateway', value: 'api-gateway' },
        { name: 'User Service', value: 'user-service' },
        { name: 'Content Service', value: 'content-service' },
        { name: 'Auth Service', value: 'auth-service' },
        { name: 'Worker Service', value: 'worker-service' },
      ],
    },
  ]);

  return services.map((service: string, index: number) => ({
    name: service,
    type: service as ServiceConfig['type'],
    port: 4000 + index,
    database: ['user-service', 'content-service'].includes(service),
  }));
}

export async function promptForTools(): Promise<string[]> {
  const { tools } = await inquirer.prompt<{ tools: string[] }>([
    {
      type: 'checkbox',
      name: 'tools',
      message: 'Select development tools to include:',
      choices: [
        { name: 'ESLint', value: 'eslint', checked: true },
        { name: 'Prettier', value: 'prettier', checked: true },
        { name: 'Husky (Git hooks)', value: 'husky', checked: true },
        { name: 'Changesets', value: 'changesets', checked: true },
        { name: 'TurboRepo', value: 'turbo', checked: true },
        { name: 'Docker', value: 'docker' },
        { name: 'Storybook', value: 'storybook' },
        { name: 'Testing Library', value: 'testing-library' },
        { name: 'Playwright (E2E)', value: 'playwright' },
      ],
    },
  ]);

  return tools;
}

export async function promptForMonorepoConfig(): Promise<MonorepoConfig> {
  console.log(chalk.blue('\n🚀 Welcome to Create Monorepo!\n'));
  console.log(
    chalk.gray('This tool will help you set up a modern monorepo development environment.\n')
  );

  const projectName = await promptForProjectName();
  const packageManager = await promptForPackageManager();
  const template = await promptForTemplate();
  const docker = await promptForDocker();
  const apps = await promptForApps();
  const packages = await promptForPackages();
  const services = await promptForServices();
  const tools = await promptForTools();

  return {
    name: projectName,
    packageManager,
    template,
    docker,
    skipInstall: false,
    skipGit: false,
    apps,
    packages,
    services,
    tools: tools.map(tool => ({
      name: tool,
      enabled: true,
    })),
  };
}
