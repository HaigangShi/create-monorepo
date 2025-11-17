import { execa } from './execa-wrapper';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';

const CLI_PATH = path.resolve(__dirname, '../../..', 'dist', 'cli.js');
const ORIGINAL_CWD = process.cwd();
const TEST_PROJECT_NAME = 'test-monorepo-e2e';

describe('CLI E2E Tests', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'create-monorepo-test-'));
    process.chdir(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    if (testDir) {
      process.chdir(ORIGINAL_CWD);
      await fs.remove(testDir);
    }
  });

  describe('Basic CLI functionality', () => {
    it('should display help when no arguments provided', async () => {
      try {
        await execa('node', [CLI_PATH]);
      } catch (error: any) {
        expect(error.stdout).toContain('create-monorepo');
        expect(error.stdout).toContain('A CLI tool for quickly initializing and managing containerized monorepo development environments');
      }
    });

    it('should display version', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--version']);
      expect(stdout).toMatch(/^\d+\.\d+\.\d+/);
    });

    it('should display help with --help flag', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--help']);
      expect(stdout).toContain('Usage: create-monorepo');
      expect(stdout).toContain('Commands:');
      expect(stdout).toContain('create');
      expect(stdout).toContain('plugin');
      expect(stdout).toContain('doctor');
    });
  });

  describe('Create command', () => {
    it('should create a basic monorepo project', async () => {
      const projectName = 'test-basic-project';
      
      const { stdout } = await execa('node', [
        CLI_PATH,
        'create',
        projectName,
        '--template=minimal',
        '--skip-install',
        '--skip-git',
      ]);

      expect(stdout).toContain('Monorepo project created successfully');
      
      // Check if project directory was created
      const projectPath = path.join(testDir, projectName);
      expect(await fs.pathExists(projectPath)).toBe(true);
      
      // Check essential files
      expect(await fs.pathExists(path.join(projectPath, 'package.json'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'pnpm-workspace.yaml'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'turbo.json'))).toBe(true);
    }, 30000);

    it('should create a project with Docker configuration', async () => {
      const projectName = 'test-docker-project';
      
      const { stdout } = await execa('node', [
        CLI_PATH,
        'create',
        projectName,
        '--template=minimal',
        '--docker',
        '--skip-install',
        '--skip-git',
      ]);

      expect(stdout).toContain('Monorepo project created successfully');
      
      // Check if Docker files were created
      const projectPath = path.join(testDir, projectName);
      expect(await fs.pathExists(path.join(projectPath, 'docker-compose.yml'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, '.dockerignore'))).toBe(true);
      expect(await fs.pathExists(path.join(projectPath, 'configs', 'docker'))).toBe(true);
    }, 30000);

    it('should fail when project name already exists', async () => {
      const projectName = 'existing-project';
      const projectPath = path.join(testDir, projectName);
      
      // Create directory first
      await fs.ensureDir(projectPath);
      
      await expect(
        execa('node', [CLI_PATH, 'create', projectName])
      ).rejects.toThrow();
    });

    it('should create a project with specific package manager', async () => {
      const projectName = 'test-pm-project';
      
      const { stdout } = await execa('node', [
        CLI_PATH,
        'create',
        projectName,
        '--package-manager=npm',
        '--template=minimal',
        '--skip-install',
        '--skip-git',
      ]);

      expect(stdout).toContain('Monorepo project created successfully');
      
      // Check package.json for package manager
      const packageJsonPath = path.join(testDir, projectName, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      expect(packageJson.packageManager).toContain('npm');
    }, 30000);
  });

  describe('Doctor command', () => {
    it('should run diagnostics in a valid monorepo', async () => {
      // First create a project
      const projectName = 'test-doctor-project';
      await execa('node', [
        CLI_PATH,
        'create',
        projectName,
        '--template=minimal',
        '--skip-install',
        '--skip-git',
      ]);

      // Change to project directory
      process.chdir(path.join(testDir, projectName));

      // Run doctor
      const { stdout } = await execa('node', [CLI_PATH, 'doctor']);
      
      expect(stdout).toContain('Running monorepo diagnostics');
      expect(stdout).toContain('Diagnostic Results');
    }, 30000);

    it('should warn when not in a monorepo directory', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'doctor']);
      
      expect(stdout).toContain('Running monorepo diagnostics');
      expect(stdout).toContain('warnings');
    });
  });

  describe('Plugin command', () => {
    it('should list available plugins', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'plugin', '--list']);
      
      expect(stdout).toContain('Available Plugins');
      expect(stdout).toContain('storybook');
      expect(stdout).toContain('playwright');
      expect(stdout).toContain('cypress');
    });

    it('should show error for invalid plugin', async () => {
      await expect(
        execa('node', [CLI_PATH, 'plugin', '--install', 'non-existent-plugin'])
      ).rejects.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle invalid project names gracefully', async () => {
      await expect(
        execa('node', [CLI_PATH, 'create', 'invalid@project!'])
      ).rejects.toThrow();
    });

    it('should handle missing required arguments', async () => {
      await expect(
        execa('node', [CLI_PATH, 'create'])
      ).rejects.toThrow();
    });
  });
});