import {
  checkPackageManagerInstalled,
  getPackageManagerInstallCommand,
  getPackageManagerAddCommand,
  getPackageManagerDevAddCommand,
  installDependencies,
} from '../../utils/package-manager';
import { execa } from 'execa';

jest.mock('execa');

const mockedExeca = execa as jest.MockedFunction<typeof execa>;

describe('Package Manager Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkPackageManagerInstalled', () => {
    it('should return true when package manager is installed', async () => {
      mockedExeca.mockResolvedValue({ stdout: '8.0.0', stderr: '', exitCode: 0 } as any);

      const result = await checkPackageManagerInstalled('pnpm');
      expect(result).toBe(true);
      expect(mockedExeca).toHaveBeenCalledWith('pnpm', ['--version']);
    });

    it('should return false when package manager is not installed', async () => {
      mockedExeca.mockRejectedValue(new Error('Command not found'));

      const result = await checkPackageManagerInstalled('pnpm');
      expect(result).toBe(false);
    });
  });

  describe('getPackageManagerInstallCommand', () => {
    it('should return correct install commands', () => {
      expect(getPackageManagerInstallCommand('npm')).toBe('npm install');
      expect(getPackageManagerInstallCommand('yarn')).toBe('yarn install');
      expect(getPackageManagerInstallCommand('pnpm')).toBe('pnpm install');
    });

    it('should throw for unsupported package manager', () => {
      expect(() => getPackageManagerInstallCommand('invalid' as any)).toThrow(
        'Unsupported package manager: invalid'
      );
    });
  });

  describe('getPackageManagerAddCommand', () => {
    it('should return correct add commands', () => {
      expect(getPackageManagerAddCommand('npm')).toBe('npm install');
      expect(getPackageManagerAddCommand('yarn')).toBe('yarn add');
      expect(getPackageManagerAddCommand('pnpm')).toBe('pnpm add');
    });
  });

  describe('getPackageManagerDevAddCommand', () => {
    it('should return correct dev add commands', () => {
      expect(getPackageManagerDevAddCommand('npm')).toBe('npm install -D');
      expect(getPackageManagerDevAddCommand('yarn')).toBe('yarn add -D');
      expect(getPackageManagerDevAddCommand('pnpm')).toBe('pnpm add -D');
    });
  });

  describe('installDependencies', () => {
    it('should install dependencies successfully', async () => {
      mockedExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);

      await installDependencies('/project/path', 'pnpm');

      expect(mockedExeca).toHaveBeenCalledWith('pnpm', ['install'], {
        cwd: '/project/path',
        stdio: 'inherit',
      });
    });

    it('should throw error when installation fails', async () => {
      mockedExeca.mockRejectedValue(new Error('Installation failed'));

      await expect(installDependencies('/project/path', 'pnpm')).rejects.toThrow(
        'Installation failed'
      );
    });
  });
});
