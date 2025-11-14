import { checkGitInstalled, checkGitClean, initializeGit } from '../../utils/git';
import { execa } from 'execa';

jest.mock('execa');

const mockedExeca = execa as jest.MockedFunction<typeof execa>;

describe('Git Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkGitInstalled', () => {
    it('should return true when git is installed', async () => {
      mockedExeca.mockResolvedValue({ stdout: 'git version 2.34.0', stderr: '', exitCode: 0 } as any);
      
      const result = await checkGitInstalled();
      expect(result).toBe(true);
      expect(mockedExeca).toHaveBeenCalledWith('git', ['--version']);
    });

    it('should return false when git is not installed', async () => {
      mockedExeca.mockRejectedValue(new Error('Command not found'));
      
      const result = await checkGitInstalled();
      expect(result).toBe(false);
    });
  });

  describe('checkGitClean', () => {
    it('should return true when git is clean', async () => {
      mockedExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
      
      const result = await checkGitClean('/project/path');
      expect(result).toBe(true);
      expect(mockedExeca).toHaveBeenCalledWith('git', ['status', '--porcelain'], { cwd: '/project/path' });
    });

    it('should return false when git has changes', async () => {
      mockedExeca.mockResolvedValue({ stdout: 'M file.txt\nA new-file.txt', stderr: '', exitCode: 0 } as any);
      
      const result = await checkGitClean('/project/path');
      expect(result).toBe(false);
    });

    it('should return false when git command fails', async () => {
      mockedExeca.mockRejectedValue(new Error('Not a git repository'));
      
      const result = await checkGitClean('/project/path');
      expect(result).toBe(false);
    });
  });

  describe('initializeGit', () => {
    it('should initialize git repository successfully', async () => {
      mockedExeca.mockResolvedValue({ stdout: '', stderr: '', exitCode: 0 } as any);
      
      await initializeGit('/project/path');
      
      expect(mockedExeca).toHaveBeenCalledWith('git', ['init'], { cwd: '/project/path' });
      expect(mockedExeca).toHaveBeenCalledWith('git', ['add', '.'], { cwd: '/project/path' });
      expect(mockedExeca).toHaveBeenCalledWith('git', ['commit', '-m', 'Initial commit'], { cwd: '/project/path' });
    });

    it('should handle git initialization errors gracefully', async () => {
      mockedExeca.mockRejectedValue(new Error('Git command failed'));
      
      // Should not throw, but log warning
      await expect(initializeGit('/project/path')).resolves.not.toThrow();
    });
  });
});