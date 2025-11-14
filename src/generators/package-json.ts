import path from 'path';
import { MonorepoConfig } from '../types';
import { writeFile } from '../utils/file-system';

export async function generatePackageJson(projectPath: string, config: MonorepoConfig): Promise<void> {
  // Generate root package.json
  const rootPackageJson = generateRootPackageJson(config);
  await writeFile(path.join(projectPath, 'package.json'), JSON.stringify(rootPackageJson, null, 2));

  // Generate pnpm-workspace.yaml
  const workspaceYaml = generateWorkspaceYaml(config);
  await writeFile(path.join(projectPath, 'pnpm-workspace.yaml'), workspaceYaml);

  // Generate turbo.json
  const turboJson = generateTurboJson(config);
  await writeFile(path.join(projectPath, 'turbo.json'), JSON.stringify(turboJson, null, 2));
}

export function generateRootPackageJson(config: MonorepoConfig): any {
  const scripts = {
    dev: 'turbo run dev',
    build: 'turbo run build',
    test: 'turbo run test',
    lint: 'turbo run lint',
    'lint:fix': 'turbo run lint:fix',
    format: 'prettier --write "**/*.{ts,tsx,js,jsx,json,md}"',
    'format:check': 'prettier --check "**/*.{ts,tsx,js,jsx,json,md}"',
    typecheck: 'turbo run typecheck',
    clean: 'turbo run clean',
    'docker:up': 'docker-compose up -d',
    'docker:down': 'docker-compose down',
  };

  const devDependencies: Record<string, string> = {
    turbo: '^1.10.0',
    typescript: '^5.2.0',
    prettier: '^3.0.0',
    husky: '^8.0.0',
    '@changesets/cli': '^2.26.0',
    ...(config.docker && {
      'docker-compose': '^0.24.0',
    }),
  };

  // Add tool-specific dependencies
  if (config.tools.some(tool => tool.name === 'eslint')) {
    devDependencies['eslint'] = '^8.0.0';
    devDependencies['@typescript-eslint/eslint-plugin'] = '^6.0.0';
    devDependencies['@typescript-eslint/parser'] = '^6.0.0';
    devDependencies['eslint-config-prettier'] = '^9.0.0';
    devDependencies['eslint-plugin-prettier'] = '^5.0.0';
  }

  return {
    name: config.name,
    version: '1.0.0',
    private: true,
    description: `A modern monorepo built with create-monorepo`,
    scripts,
    devDependencies,
    engines: {
      node: '>=16.0.0',
      pnpm: '>=8.0.0',
    },
    packageManager: `pnpm@8.0.0`,
  };
}

function generateWorkspaceYaml(config: MonorepoConfig): string {
  return `packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'`;
}

function generateTurboJson(config: MonorepoConfig): any {
  const pipeline = {
    build: {
      dependsOn: ['^build'],
      outputs: ['dist/**', '.next/**', '!.next/cache/**'],
    },
    dev: {
      cache: false,
      persistent: true,
    },
    test: {
      dependsOn: ['build'],
      outputs: ['coverage/**'],
    },
    lint: {
      dependsOn: ['^build'],
    },
    'lint:fix': {
      cache: false,
    },
    typecheck: {
      dependsOn: ['^build'],
    },
    clean: {
      cache: false,
    },
  };

  return {
    $schema: 'https://turbo.build/schema.json',
    globalDependencies: ['**/.env.*local'],
    pipeline,
  };
}