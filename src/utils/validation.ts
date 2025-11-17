import semver from 'semver';
import validateNpmPackageName from 'validate-npm-package-name';
import chalk from 'chalk';

const MIN_NODE_VERSION = '16.0.0';

export function validateNodeVersion(): void {
  const currentVersion = process.version;
  if (!semver.satisfies(currentVersion, `>=${MIN_NODE_VERSION}`)) {
    throw new Error(
      chalk.red(
        `Node.js version ${currentVersion} is not supported. Please upgrade to Node.js ${MIN_NODE_VERSION} or higher.`
      )
    );
  }
}

export function validateProjectName(name: string): { valid: boolean; errors: string[] } {
  const validation = validateNpmPackageName(name);
  const pattern = /^[a-z][a-z0-9-_]*$/;
  const customErrors: string[] = [];
  if (!name || !pattern.test(name)) {
    customErrors.push(
      'Name must start with a letter and contain only lowercase letters, numbers, - or _'
    );
  }
  if (validation.validForNewPackages && customErrors.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors = [...(validation.errors || []), ...(validation.warnings || []), ...customErrors];

  return { valid: false, errors };
}

export function validatePackageManager(pm: string): boolean {
  const validPackageManagers = ['npm', 'yarn', 'pnpm'];
  return validPackageManagers.includes(pm);
}

export function validatePort(port: number): boolean {
  return port >= 1024 && port <= 65535;
}

export function validateTemplate(template: string): boolean {
  const validTemplates = [
    'default',
    'next-fullstack',
    'vue-fullstack',
    'react-fullstack',
    'minimal',
    'enterprise',
  ];
  return validTemplates.includes(template);
}

export function sanitizeProjectName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}
