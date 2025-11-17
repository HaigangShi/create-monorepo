import { generateRootPackageJson } from '../../generators/package-json';
import { MonorepoConfig } from '../../types';

describe('Package.json Generator', () => {
  const mockConfig: MonorepoConfig = {
    name: 'test-monorepo',
    packageManager: 'pnpm',
    template: 'default',
    docker: true,
    skipInstall: false,
    skipGit: false,
    apps: [],
    packages: [],
    services: [],
    tools: [
      { name: 'eslint', enabled: true },
      { name: 'prettier', enabled: true },
    ],
  };

  describe('generateRootPackageJson', () => {
    it('should generate basic package.json structure', () => {
      const result = generateRootPackageJson(mockConfig);

      expect(result.name).toBe('test-monorepo');
      expect(result.version).toBe('1.0.0');
      expect(result.private).toBe(true);
      expect(result.description).toContain('modern monorepo');
    });

    it('should include correct scripts', () => {
      const result = generateRootPackageJson(mockConfig);

      expect(result.scripts).toBeDefined();
      expect(result.scripts.dev).toBe('turbo run dev');
      expect(result.scripts.build).toBe('turbo run build');
      expect(result.scripts.test).toBe('turbo run test');
      expect(result.scripts.lint).toBe('turbo run lint');
    });

    it('should include Docker scripts when docker is enabled', () => {
      const result = generateRootPackageJson(mockConfig);

      expect(result.scripts['docker:up']).toBe('docker-compose up -d');
      expect(result.scripts['docker:down']).toBe('docker-compose down');
    });

    it('should include ESLint dependencies when enabled', () => {
      const result = generateRootPackageJson(mockConfig);

      expect(result.devDependencies.eslint).toBeDefined();
      expect(result.devDependencies['@typescript-eslint/eslint-plugin']).toBeDefined();
      expect(result.devDependencies['@typescript-eslint/parser']).toBeDefined();
    });

    it('should set correct engines', () => {
      const result = generateRootPackageJson(mockConfig);

      expect(result.engines).toBeDefined();
      expect(result.engines.node).toBe('>=16.0.0');
      expect(result.engines.pnpm).toBe('>=8.0.0');
    });

    it('should set packageManager field', () => {
      const result = generateRootPackageJson(mockConfig);

      expect(result.packageManager).toBe('pnpm@8.0.0');
    });
  });
});
