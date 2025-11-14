import { validateNodeVersion, validateProjectName, validatePackageManager, sanitizeProjectName } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateNodeVersion', () => {
    const originalVersion = process.version;

    afterEach(() => {
      Object.defineProperty(process, 'version', {
        value: originalVersion,
        writable: true,
        configurable: true,
      });
    });

    it('should not throw for Node.js 16+', () => {
      Object.defineProperty(process, 'version', {
        value: 'v16.0.0',
        writable: true,
        configurable: true,
      });

      expect(() => validateNodeVersion()).not.toThrow();
    });

    it('should throw for Node.js below 16', () => {
      Object.defineProperty(process, 'version', {
        value: 'v14.0.0',
        writable: true,
        configurable: true,
      });

      expect(() => validateNodeVersion()).toThrow('Node.js version v14.0.0 is not supported');
    });
  });

  describe('validateProjectName', () => {
    it('should validate valid project names', () => {
      const validNames = [
        'my-project',
        'test_project',
        'simple',
        'my-test-project-123',
      ];

      validNames.forEach(name => {
        const result = validateProjectName(name);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    it('should invalidate invalid project names', () => {
      const invalidNames = [
        'My Project',
        'my@project',
        'my/project',
        'my\\project',
        '',
        '123', // starts with number
      ];

      invalidNames.forEach(name => {
        const result = validateProjectName(name);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validatePackageManager', () => {
    it('should validate valid package managers', () => {
      const validManagers = ['npm', 'yarn', 'pnpm'];

      validManagers.forEach(pm => {
        expect(validatePackageManager(pm)).toBe(true);
      });
    });

    it('should invalidate invalid package managers', () => {
      const invalidManagers = ['pip', 'gem', 'cargo', 'composer'];

      invalidManagers.forEach(pm => {
        expect(validatePackageManager(pm)).toBe(false);
      });
    });
  });

  describe('sanitizeProjectName', () => {
    it('should sanitize project names correctly', () => {
      const testCases = [
        { input: 'My Project', expected: 'my-project' },
        { input: '  my-project  ', expected: 'my-project' },
        { input: 'My@Project!', expected: 'myproject' },
        { input: 'My_Project', expected: 'my_project' },
        { input: '123-project', expected: '123-project' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(sanitizeProjectName(input)).toBe(expected);
      });
    });
  });
});