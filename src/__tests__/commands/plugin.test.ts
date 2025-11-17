import { managePlugins, installStorybook, installPlaywright } from '../../commands/plugin';
import { fileExists, readFile, writeFile } from '../../utils/file-system';

jest.mock('../../utils/file-system');

const mockedFileExists = fileExists as jest.MockedFunction<typeof fileExists>;
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

describe('Plugin Command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFileExists.mockResolvedValue(true);
    mockedReadFile.mockResolvedValue('{}');
    mockedWriteFile.mockResolvedValue(undefined);
  });

  describe('managePlugins', () => {
    it('should list available plugins', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await managePlugins({ list: true });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Available Plugins'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('storybook'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('playwright'));

      consoleSpy.mockRestore();
    });

    it('should install a plugin', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await managePlugins({ install: 'storybook' });

      expect(mockedWriteFile).toHaveBeenCalledWith('./package.json', expect.any(String));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('installed successfully'));

      consoleSpy.mockRestore();
    });

    it('should uninstall a plugin', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await managePlugins({ uninstall: 'storybook' });

      expect(mockedWriteFile).toHaveBeenCalledWith('./package.json', expect.any(String));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('uninstalled successfully'));

      consoleSpy.mockRestore();
    });

    it('should show error for non-existent plugin', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process.exit');
      });

      await expect(managePlugins({ install: 'non-existent' })).rejects.toThrow('Process.exit');

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));

      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should show help when no options provided', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await managePlugins({});

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Available Plugins'));

      consoleSpy.mockRestore();
    });

    it('should show error when not in monorepo directory', async () => {
      mockedFileExists.mockResolvedValue(false);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process.exit');
      });

      await expect(managePlugins({ install: 'storybook' })).rejects.toThrow('Process.exit');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Not in a monorepo project directory')
      );

      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    });
  });

  describe('installStorybook', () => {
    it('should add Storybook dependencies and scripts', async () => {
      const mockConfig = {
        devDependencies: {},
        scripts: {},
      };

      mockedReadFile.mockResolvedValue(JSON.stringify(mockConfig));

      await installStorybook(mockConfig);

      expect(mockedWriteFile).toHaveBeenCalledWith(
        './package.json',
        expect.stringContaining('@storybook/react')
      );
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '.storybook/main.ts',
        expect.stringContaining('stories')
      );
    });
  });

  describe('installPlaywright', () => {
    it('should add Playwright dependencies and scripts', async () => {
      const mockConfig = {
        devDependencies: {},
        scripts: {},
      };

      mockedReadFile.mockResolvedValue(JSON.stringify(mockConfig));

      await installPlaywright(mockConfig);

      expect(mockedWriteFile).toHaveBeenCalledWith(
        './package.json',
        expect.stringContaining('@playwright/test')
      );
      expect(mockedWriteFile).toHaveBeenCalledWith(
        'playwright.config.ts',
        expect.stringContaining('testDir')
      );
    });
  });
});
