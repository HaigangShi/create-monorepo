import {
  fileExists,
  ensureDir,
  writeFile,
  readFile,
  createDirectoryStructure,
  formatJson,
  parseJson,
} from '../../utils/file-system';
import fs from 'fs-extra';
import path from 'path';

jest.mock('fs-extra');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('File System Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fileExists', () => {
    it('should return true if file exists', async () => {
      mockedFs.access.mockResolvedValue(undefined);

      const result = await fileExists('/path/to/file');
      expect(result).toBe(true);
      expect(mockedFs.access).toHaveBeenCalledWith('/path/to/file');
    });

    it('should return false if file does not exist', async () => {
      mockedFs.access.mockRejectedValue(new Error('File not found'));

      const result = await fileExists('/path/to/nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('ensureDir', () => {
    it('should create directory', async () => {
      mockedFs.ensureDir.mockResolvedValue(undefined);

      await ensureDir('/path/to/dir');
      expect(mockedFs.ensureDir).toHaveBeenCalledWith('/path/to/dir');
    });
  });

  describe('writeFile', () => {
    it('should write file with content', async () => {
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      await writeFile('/path/to/file.txt', 'content');

      expect(mockedFs.ensureDir).toHaveBeenCalledWith('/path');
      expect(mockedFs.writeFile).toHaveBeenCalledWith('/path/to/file.txt', 'content', 'utf8');
    });
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      mockedFs.readFile.mockResolvedValue('file content');

      const result = await readFile('/path/to/file.txt');
      expect(result).toBe('file content');
      expect(mockedFs.readFile).toHaveBeenCalledWith('/path/to/file.txt', 'utf8');
    });
  });

  describe('createDirectoryStructure', () => {
    it('should create directory structure with files and directories', async () => {
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      const structure = {
        'file.txt': 'content',
        dir: {
          'nested.txt': 'nested content',
        },
      };

      await createDirectoryStructure('/base', structure);

      expect(mockedFs.writeFile).toHaveBeenCalledWith('/base/file.txt', 'content');
      expect(mockedFs.ensureDir).toHaveBeenCalledWith('/base/dir');
      expect(mockedFs.writeFile).toHaveBeenCalledWith('/base/dir/nested.txt', 'nested content');
    });

    it('should handle empty directories', async () => {
      mockedFs.ensureDir.mockResolvedValue(undefined);

      const structure = {
        'empty-dir': null,
      };

      await createDirectoryStructure('/base', structure);

      expect(mockedFs.ensureDir).toHaveBeenCalledWith('/base/empty-dir');
    });
  });

  describe('formatJson', () => {
    it('should format JSON with proper indentation', () => {
      const obj = { name: 'test', version: '1.0.0' };
      const result = formatJson(obj, 2);

      expect(result).toBe(JSON.stringify(obj, null, 2));
    });

    it('should use custom indentation', () => {
      const obj = { name: 'test' };
      const result = formatJson(obj, 4);

      expect(result).toBe(JSON.stringify(obj, null, 4));
    });
  });

  describe('parseJson', () => {
    it('should parse valid JSON', () => {
      const jsonString = '{"name": "test", "version": "1.0.0"}';
      const result = parseJson(jsonString);

      expect(result).toEqual({ name: 'test', version: '1.0.0' });
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = '{invalid json}';

      expect(() => parseJson(invalidJson)).toThrow('Invalid JSON');
    });
  });
});
