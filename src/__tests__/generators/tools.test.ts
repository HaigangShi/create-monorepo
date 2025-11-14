import { generateToolConfigs } from '../../generators/tools';
import { MonorepoConfig } from '../../types';
import { writeFile } from '../../utils/file-system';

jest.mock('../../utils/file-system');

const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

describe('Tools Generator', () => {
  const mockConfig: MonorepoConfig = {
    name: 'test-monorepo',
    packageManager: 'pnpm',
    template: 'default',
    docker: false,
    skipInstall: false,
    skipGit: false,
    apps: [],
    packages: [],
    services: [],
    tools: [
      { name: 'eslint', enabled: true },
      { name: 'prettier', enabled: true },
      { name: 'husky', enabled: true },
      { name: 'changesets', enabled: true },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedWriteFile.mockResolvedValue(undefined);
  });

  describe('generateToolConfigs', () => {
    it('should generate .gitignore', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.gitignore',
        expect.stringContaining('node_modules')
      );
    });

    it('should generate ESLint config when enabled', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.eslintrc.js',
        expect.stringContaining('module.exports')
      );
    });

    it('should generate Prettier config when enabled', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.prettierrc',
        expect.stringContaining('{')
      );
    });

    it('should generate Husky configs when enabled', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.husky/pre-commit',
        expect.stringContaining('pnpm lint-staged')
      );
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.husky/commit-msg',
        expect.stringContaining('pnpm commitlint')
      );
    });

    it('should generate Changesets config when enabled', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.changeset/config.json',
        expect.stringContaining('changelog')
      );
    });

    it('should generate environment files', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.env.example',
        expect.stringContaining('NODE_ENV')
      );
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.env.local',
        expect.stringContaining('NODE_ENV=development')
      );
    });

    it('should generate VS Code configuration', async () => {
      await generateToolConfigs('/project/path', mockConfig);
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.vscode/settings.json',
        expect.stringContaining('editor.defaultFormatter')
      );
      
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.vscode/extensions.json',
        expect.stringContaining('recommendations')
      );
    });

    it('should not generate configs for disabled tools', async () => {
      const configWithDisabledTools = {
        ...mockConfig,
        tools: [
          { name: 'eslint', enabled: false },
          { name: 'prettier', enabled: false },
        ],
      };

      await generateToolConfigs('/project/path', configWithDisabledTools);
      
      // Should still generate .gitignore and env files
      expect(mockedWriteFile).toHaveBeenCalledWith(
        '/project/path/.gitignore',
        expect.any(String)
      );
      
      // Should not generate ESLint or Prettier configs
      const calls = mockedWriteFile.mock.calls;
      const eslintCall = calls.find(call => call[0].includes('.eslintrc'));
      const prettierCall = calls.find(call => call[0].includes('.prettierrc'));
      
      expect(eslintCall).toBeUndefined();
      expect(prettierCall).toBeUndefined();
    });
  });
});