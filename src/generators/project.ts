import path from 'path';
import { MonorepoConfig } from '../types';
import { ensureDir, createDirectoryStructure, DirectoryStructure } from '../utils/file-system';

export async function generateProjectStructure(
  projectPath: string,
  config: MonorepoConfig
): Promise<void> {
  // Create root directories
  const directories = [
    'apps',
    'packages',
    'services',
    'configs',
    'scripts',
    'docs',
    '.changeset',
    '.devcontainer',
    '.github/workflows',
    '.husky',
    '.vscode',
  ];

  for (const dir of directories) {
    await ensureDir(path.join(projectPath, dir));
  }

  // Create subdirectories based on configuration
  await createAppsStructure(projectPath, config);
  await createPackagesStructure(projectPath, config);
  await createServicesStructure(projectPath, config);
  await createConfigStructure(projectPath);
  await createScriptStructure(projectPath);
  await createDocumentationStructure(projectPath);
  await createGitHubStructure(projectPath);
  await createDevContainerStructure(projectPath);
}

async function createAppsStructure(projectPath: string, config: MonorepoConfig): Promise<void> {
  for (const app of config.apps) {
    const appPath = path.join(projectPath, 'apps', app.name);
    await ensureDir(appPath);

    // Create app-specific structure based on type
    switch (app.type) {
      case 'next':
        await createNextAppStructure(appPath);
        break;
      case 'vue':
        await createVueAppStructure(appPath);
        break;
      case 'react':
        await createReactAppStructure(appPath);
        break;
      case 'svelte':
        await createSvelteAppStructure(appPath);
        break;
    }
  }
}

async function createNextAppStructure(appPath: string): Promise<void> {
  const structure = {
    src: {
      app: null,
      components: null,
      lib: null,
      styles: null,
    },
    public: null,
    'next.config.ts': getNextConfig(),
    'package.json': getNextPackageJson(),
    'tsconfig.json': getNextTsConfig(),
    'tailwind.config.ts': getTailwindConfig(),
    'postcss.config.js': getPostcssConfig(),
  };

  await createDirectoryStructure(appPath, structure);
}

async function createVueAppStructure(appPath: string): Promise<void> {
  const structure = {
    src: {
      views: null,
      components: null,
      composables: null,
      router: null,
      assets: null,
    },
    public: null,
    'package.json': getVuePackageJson(),
    'vite.config.ts': getViteConfig(),
    'tsconfig.json': getTsConfig(),
    'tailwind.config.ts': getTailwindConfig(),
    'postcss.config.js': getPostcssConfig(),
  };

  await createDirectoryStructure(appPath, structure);
}

async function createReactAppStructure(appPath: string): Promise<void> {
  const structure = {
    src: {
      pages: null,
      components: null,
      hooks: null,
      assets: null,
    },
    public: null,
    'package.json': getReactPackageJson(),
    'vite.config.ts': getViteConfig(),
    'tsconfig.json': getTsConfig(),
    'tailwind.config.ts': getTailwindConfig(),
    'postcss.config.js': getPostcssConfig(),
  };

  await createDirectoryStructure(appPath, structure);
}

async function createSvelteAppStructure(appPath: string): Promise<void> {
  const structure = {
    src: {
      routes: null,
      lib: null,
      components: null,
    },
    static: null,
    'package.json': getSveltePackageJson(),
    'vite.config.ts': getViteConfig(),
    'tsconfig.json': getTsConfig(),
    'tailwind.config.ts': getTailwindConfig(),
    'postcss.config.js': getPostcssConfig(),
  };

  await createDirectoryStructure(appPath, structure);
}

async function createPackagesStructure(projectPath: string, config: MonorepoConfig): Promise<void> {
  for (const pkg of config.packages) {
    const packagePath = path.join(projectPath, 'packages', pkg.name);
    await ensureDir(packagePath);

    const structure = {
      src: null,
      'package.json': getPackagePackageJson(pkg.name),
      'tsconfig.json': getTsConfig(),
      'README.md': getPackageReadme(pkg.name, pkg.type),
    };

    await createDirectoryStructure(packagePath, structure);
  }
}

async function createServicesStructure(projectPath: string, config: MonorepoConfig): Promise<void> {
  for (const service of config.services) {
    const servicePath = path.join(projectPath, 'services', service.name);
    await ensureDir(servicePath);

    const structure: Record<string, string | null | DirectoryStructure> = {
      src: {
        controllers: null,
        services: null,
        models: null,
        routes: null,
        middleware: null,
      },
      'package.json': getServicePackageJson(service.name),
      'tsconfig.json': getTsConfig(),
      'README.md': getServiceReadme(service.name, service.type),
    };

    if (service.database) {
      structure.prisma = null;
    }

    await createDirectoryStructure(servicePath, structure);
  }
}

async function createConfigStructure(projectPath: string): Promise<void> {
  const configPath = path.join(projectPath, 'configs');

  const structure = {
    eslint: {
      'base.json': getBaseEslintConfig(),
      'next.json': getNextEslintConfig(),
      'vue.json': getVueEslintConfig(),
      'backend.json': getBackendEslintConfig(),
    },
    typescript: {
      'base.json': getBaseTsConfig(),
      'next.json': getNextTsConfigTemplate(),
      'vue.json': getVueTsConfig(),
      'node.json': getNodeTsConfig(),
    },
    vite: {
      'web.config.ts': getViteWebConfig(),
      'lib.config.ts': getViteLibConfig(),
    },
    jest: {
      'base.js': getBaseJestConfig(),
      'web.js': getWebJestConfig(),
    },
    tailwind: {
      'base.config.ts': getBaseTailwindConfig(),
    },
    env: {
      'env-schema.ts': getEnvSchema(),
      'development.ts': getDevelopmentEnv(),
      'production.ts': getProductionEnv(),
    },
  };

  await createDirectoryStructure(configPath, structure);
}

async function createScriptStructure(projectPath: string): Promise<void> {
  const scriptsPath = path.join(projectPath, 'scripts');

  const structure = {
    build: {
      'build-all.ts': getBuildAllScript(),
      'build-web.ts': getBuildWebScript(),
      'build-service.ts': getBuildServiceScript(),
    },
    deploy: {
      'deploy-prod.ts': getDeployProdScript(),
      'deploy-staging.ts': getDeployStagingScript(),
    },
    database: {
      'migrate.ts': getMigrateScript(),
      'seed.ts': getSeedScript(),
    },
    utils: {
      'env-check.ts': getEnvCheckScript(),
      'dependency-check.ts': getDependencyCheckScript(),
    },
  };

  await createDirectoryStructure(scriptsPath, structure);
}

async function createDocumentationStructure(projectPath: string): Promise<void> {
  const docsPath = path.join(projectPath, 'docs');

  const structure = {
    architecture: {
      'tech-stack.md': getTechStackDoc(),
      'directory-structure.md': getDirectoryStructureDoc(),
      'deployment.md': getDeploymentDoc(),
    },
    development: {
      'setup.md': getSetupDoc(),
      'coding-standards.md': getCodingStandardsDoc(),
      'testing.md': getTestingDoc(),
    },
    api: {
      'rest-api.md': getRestApiDoc(),
    },
    operations: {
      'monitoring.md': getMonitoringDoc(),
      'troubleshooting.md': getTroubleshootingDoc(),
    },
  };

  await createDirectoryStructure(docsPath, structure);
}

async function createGitHubStructure(projectPath: string): Promise<void> {
  const githubPath = path.join(projectPath, '.github', 'workflows');

  const structure = {
    'ci.yml': getCiWorkflow(),
    'release.yml': getReleaseWorkflow(),
    'preview.yml': getPreviewWorkflow(),
    'security.yml': getSecurityWorkflow(),
  };

  await createDirectoryStructure(githubPath, structure);
}

async function createDevContainerStructure(projectPath: string): Promise<void> {
  const devcontainerPath = path.join(projectPath, '.devcontainer');

  const structure = {
    'devcontainer.json': getDevContainerConfig(),
  };

  await createDirectoryStructure(devcontainerPath, structure);
}

// Template content functions
function getNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;`;
}

function getViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});`;
}

function getTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue,svelte}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
}

function getPostcssConfig(): string {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
}

function getTsConfig(): string {
  return `{
  "extends": "../../configs/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`;
}

function getNextTsConfigTemplate(): string {
  return `{
  "extends": "../../configs/typescript/next.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
}

function getNextPackageJson(): string {
  return JSON.stringify(
    {
      name: '@monorepo/next-app',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        eslint: '^8.0.0',
        'eslint-config-next': '^14.0.0',
      },
    },
    null,
    2
  );
}

function getVuePackageJson(): string {
  return JSON.stringify(
    {
      name: '@monorepo/vue-app',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        vue: '^3.3.0',
        'vue-router': '^4.2.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        vite: '^4.4.0',
        '@vitejs/plugin-vue': '^4.2.0',
        'vue-tsc': '^1.8.0',
      },
    },
    null,
    2
  );
}

function getReactPackageJson(): string {
  return JSON.stringify(
    {
      name: '@monorepo/react-app',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        vite: '^4.4.0',
        '@vitejs/plugin-react': '^4.0.0',
      },
    },
    null,
    2
  );
}

function getSveltePackageJson(): string {
  return JSON.stringify(
    {
      name: '@monorepo/svelte-app',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        svelte: '^4.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        vite: '^4.4.0',
        '@sveltejs/vite-plugin-svelte': '^2.4.0',
      },
    },
    null,
    2
  );
}

function getPackagePackageJson(name: string): string {
  return JSON.stringify(
    {
      name: `@monorepo/${name}`,
      version: '1.0.0',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        lint: 'eslint src --ext .ts',
      },
      devDependencies: {
        typescript: '^5.0.0',
        eslint: '^8.0.0',
      },
    },
    null,
    2
  );
}

function getServicePackageJson(name: string): string {
  return JSON.stringify(
    {
      name: `@monorepo/${name}`,
      version: '1.0.0',
      main: 'dist/index.js',
      scripts: {
        build: 'tsc',
        dev: 'ts-node-dev src/index.ts',
        start: 'node dist/index.js',
        lint: 'eslint src --ext .ts',
      },
      dependencies: {
        express: '^4.18.0',
        cors: '^2.8.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        'ts-node-dev': '^2.0.0',
        '@types/node': '^20.0.0',
        '@types/express': '^4.17.0',
        '@types/cors': '^2.8.0',
        eslint: '^8.0.0',
      },
    },
    null,
    2
  );
}

function getPackageReadme(name: string, type: string): string {
  return `# @monorepo/${name}

This is a shared ${type} package for the monorepo.

## Usage

\`\`\`typescript
import { something } from '@monorepo/${name}';
\`\`\`

## Development

\`\`\`bash
npm run dev  # Watch mode
npm run build  # Build package
\`\`\`
`;
}

function getServiceReadme(name: string, type: string): string {
  return `# @monorepo/${name}

This is a ${type} service for the monorepo.

## Development

\`\`\`bash
npm run dev  # Development mode
npm run build  # Build service
npm start  # Start production server
\`\`\`

## API

The service runs on port configured in environment variables.
`;
}

function getBaseEslintConfig(): string {
  return JSON.stringify(
    {
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'no-console': 'off',
      },
    },
    null,
    2
  );
}

function getNextEslintConfig(): string {
  return JSON.stringify(
    {
      extends: ['./base.json', 'next/core-web-vitals'],
    },
    null,
    2
  );
}

function getVueEslintConfig(): string {
  return JSON.stringify(
    {
      extends: ['./base.json', 'plugin:vue/vue3-essential'],
    },
    null,
    2
  );
}

function getBackendEslintConfig(): string {
  return JSON.stringify(
    {
      extends: ['./base.json'],
      env: {
        node: true,
      },
    },
    null,
    2
  );
}

function getBaseTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        resolveJsonModule: true,
      },
    },
    null,
    2
  );
}

function getNextTsConfig(): string {
  return JSON.stringify(
    {
      extends: './base.json',
      compilerOptions: {
        plugins: [
          {
            name: 'next',
          },
        ],
      },
    },
    null,
    2
  );
}

function getVueTsConfig(): string {
  return JSON.stringify(
    {
      extends: './base.json',
    },
    null,
    2
  );
}

function getNodeTsConfig(): string {
  return JSON.stringify(
    {
      extends: './base.json',
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
      },
    },
    null,
    2
  );
}

function getViteWebConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});`;
}

function getViteLibConfig(): string {
  return `import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: 'my-lib',
    },
  },
});`;
}

function getBaseJestConfig(): string {
  return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\\\.ts$': 'ts-jest',
  },
};`;
}

function getWebJestConfig(): string {
  return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\\\.ts$': 'ts-jest',
  },
};`;
}

function getBaseTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
}

function getEnvSchema(): string {
  return `import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;`;
}

function getDevelopmentEnv(): string {
  return `export default {
  NODE_ENV: 'development',
  PORT: 3000,
};`;
}

function getProductionEnv(): string {
  return `export default {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3000,
};`;
}

function getBuildAllScript(): string {
  return `#!/usr/bin/env node

import { execa } from 'execa';
import path from 'path';

async function buildAll() {
  console.log('Building all packages and apps...');
  
  try {
    await execa('turbo', ['run', 'build'], { stdio: 'inherit' });
    console.log('✅ All builds completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildAll();`;
}

function getBuildWebScript(): string {
  return `#!/usr/bin/env node

import { execa } from 'execa';

async function buildWeb() {
  console.log('Building web applications...');
  
  try {
    await execa('turbo', ['run', 'build', '--filter=./apps/*'], { stdio: 'inherit' });
    console.log('✅ Web builds completed successfully');
  } catch (error) {
    console.error('❌ Web build failed:', error);
    process.exit(1);
  }
}

buildWeb();`;
}

function getBuildServiceScript(): string {
  return `#!/usr/bin/env node

import { execa } from 'execa';

async function buildServices() {
  console.log('Building services...');
  
  try {
    await execa('turbo', ['run', 'build', '--filter=./services/*'], { stdio: 'inherit' });
    console.log('✅ Service builds completed successfully');
  } catch (error) {
    console.error('❌ Service build failed:', error);
    process.exit(1);
  }
}

buildServices();`;
}

function getDeployProdScript(): string {
  return `#!/usr/bin/env node

async function deployProd() {
  console.log('Deploying to production...');
  // Add your production deployment logic here
}

deployProd();`;
}

function getDeployStagingScript(): string {
  return `#!/usr/bin/env node

async function deployStaging() {
  console.log('Deploying to staging...');
  // Add your staging deployment logic here
}

deployStaging();`;
}

function getMigrateScript(): string {
  return `#!/usr/bin/env node

async function migrate() {
  console.log('Running database migrations...');
  // Add your migration logic here
}

migrate();`;
}

function getSeedScript(): string {
  return `#!/usr/bin/env node

async function seed() {
  console.log('Seeding database...');
  // Add your seeding logic here
}

seed();`;
}

function getEnvCheckScript(): string {
  return `#!/usr/bin/env node

import { envSchema } from '../configs/env/env-schema';

function envCheck() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables are valid');
  } catch (error) {
    console.error('❌ Environment variables validation failed:', error);
    process.exit(1);
  }
}

envCheck();`;
}

function getDependencyCheckScript(): string {
  return `#!/usr/bin/env node

import { execa } from 'execa';

async function dependencyCheck() {
  console.log('Checking dependencies...');
  
  try {
    await execa('npm', ['audit'], { stdio: 'inherit' });
    console.log('✅ Dependencies check completed');
  } catch (error) {
    console.error('❌ Dependencies check failed:', error);
    process.exit(1);
  }
}

dependencyCheck();`;
}

function getTechStackDoc(): string {
  return `# Technology Stack

This document outlines the technology stack used in this monorepo.

## Frontend

- **Next.js**: React framework for production
- **Vue.js**: Progressive JavaScript framework
- **React**: UI library for building user interfaces
- **Svelte**: Cybernetically enhanced web apps

## Backend

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **Prisma**: Database toolkit

## Development Tools

- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TurboRepo**: Build system

## Containerization

- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration`;
}

function getDirectoryStructureDoc(): string {
  return `# Directory Structure

This document describes the directory structure of this monorepo.

## Root Level

- \`apps/\`: Frontend applications
- \`packages/\`: Shared packages
- \`services/\`: Backend services
- \`configs/\`: Shared configuration files
- \`scripts/\`: Build and utility scripts
- \`docs/\`: Documentation

## Application Structure

Each application in \`apps/\` follows its own conventions based on the framework used.

## Package Structure

Each package in \`packages/\` contains:
- \`src/\`: Source code
- \`package.json\`: Package configuration
- \`tsconfig.json\`: TypeScript configuration

## Service Structure

Each service in \`services/\` contains:
- \`src/\`: Source code
- \`package.json\`: Service configuration
- \`tsconfig.json\`: TypeScript configuration`;
}

function getDeploymentDoc(): string {
  return `# Deployment

This document describes the deployment process for this monorepo.

## Docker Deployment

1. Build all services:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start with Docker Compose:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

## Manual Deployment

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Build applications:
   \`\`\`bash
   pnpm run build
   \`\`\`

3. Start services:
   \`\`\`bash
   pnpm start
   \`\`\``;
}

function getSetupDoc(): string {
  return `# Development Setup

This guide will help you set up the development environment for this monorepo.

## Prerequisites

- Node.js 16+
- pnpm (recommended) or npm/yarn
- Git

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd <project-name>
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Start development:
   \`\`\`bash
   pnpm run dev
   \`\`\`

## Development Commands

- \`pnpm run dev\`: Start development mode
- \`pnpm run build\`: Build all packages and apps
- \`pnpm run test\`: Run tests
- \`pnpm run lint\`: Lint code`;
}

function getCodingStandardsDoc(): string {
  return `# Coding Standards

This document outlines the coding standards for this monorepo.

## TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over type aliases
- Use explicit return types for functions

## Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use consistent naming conventions

## Git Commits

- Use conventional commits
- Keep commits atomic and focused
- Write clear commit messages

## Testing

- Write unit tests for utilities
- Write integration tests for services
- Maintain test coverage above 80%`;
}

function getTestingDoc(): string {
  return `# Testing

This document describes the testing strategy for this monorepo.

## Unit Tests

Unit tests are located alongside source files with \`.test.ts\` extension.

## Integration Tests

Integration tests are in \`__tests__/integration/\` directories.

## E2E Tests

End-to-end tests use Playwright and are in \`e2e/\` directories.

## Running Tests

- Unit tests: \`pnpm test\`
- Integration tests: \`pnpm test:integration\`
- E2E tests: \`pnpm test:e2e\`
- All tests: \`pnpm test:all\``;
}

function getRestApiDoc(): string {
  return `# REST API

This document describes the REST API endpoints available in this monorepo.

## Authentication

Most endpoints require authentication via JWT tokens.

## API Endpoints

### Users

- \`GET /api/users\`: List users
- \`POST /api/users\`: Create user
- \`GET /api/users/:id\`: Get user by ID
- \`PUT /api/users/:id\`: Update user
- \`DELETE /api/users/:id\`: Delete user

### Content

- \`GET /api/content\`: List content
- \`POST /api/content\`: Create content
- \`GET /api/content/:id\`: Get content by ID

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
\`\`\``;
}

function getMonitoringDoc(): string {
  return `# Monitoring

This document describes monitoring and observability for this monorepo.

## Health Checks

All services expose health check endpoints:

- \`GET /health\`: Basic health check
- \`GET /health/detailed\`: Detailed health check

## Metrics

Services expose Prometheus metrics at:

- \`GET /metrics\`: Prometheus metrics

## Logging

- Use structured logging (JSON format)
- Include correlation IDs
- Log at appropriate levels (error, warn, info, debug)`;
}

function getTroubleshootingDoc(): string {
  return `# Troubleshooting

This document provides solutions to common issues.

## Build Issues

### TypeScript Errors

1. Check \`tsconfig.json\` configuration
2. Run \`pnpm run typecheck\`
3. Clear \`node_modules\` and reinstall

### Dependency Issues

1. Delete \`node_modules\` and \`pnpm-lock.yaml\`
2. Run \`pnpm install\`
3. Check for peer dependency conflicts

## Runtime Issues

### Port Conflicts

1. Check if ports are in use: \`lsof -i :3000\`
2. Modify port configuration in \`package.json\`
3. Use different ports for each service

### Database Connection Issues

1. Check database service is running
2. Verify connection string in \`.env\`
3. Check database migrations`;
}

function getCiWorkflow(): string {
  return `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Run linting
        run: pnpm lint
      
      - name: Run type checking
        run: pnpm typecheck`;
}

function getReleaseWorkflow(): string {
  return `name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Create Release
        run: pnpm changeset publish
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`;
}

function getPreviewWorkflow(): string {
  return `name: Preview

on:
  pull_request:
    branches: [main, develop]

jobs:
  preview:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build applications
        run: pnpm run build
      
      - name: Deploy preview
        run: |
          echo "Preview deployment would happen here"
          # Add your preview deployment logic`;
}

function getSecurityWorkflow(): string {
  return `name: Security

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run security audit
        run: pnpm audit
      
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: typescript`;
}

function getDevContainerConfig(): string {
  return JSON.stringify(
    {
      name: 'Monorepo Development Container',
      image: 'mcr.microsoft.com/devcontainers/typescript-node:18',
      features: {
        'ghcr.io/devcontainers/features/docker-in-docker:2': {},
        'ghcr.io/devcontainers/features/github-cli:1': {},
      },
      customizations: {
        vscode: {
          extensions: [
            'dbaeumer.vscode-eslint',
            'esbenp.prettier-vscode',
            'bradlc.vscode-tailwindcss',
            'ms-vscode.vscode-typescript-next',
          ],
        },
      },
      postCreateCommand: 'pnpm install',
      remoteUser: 'node',
    },
    null,
    2
  );
}
