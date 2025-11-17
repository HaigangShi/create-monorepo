// Test setup file
import { jest } from '@jest/globals';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock process.exit to prevent tests from exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
  throw new Error(`Process.exit called with code: ${code}`);
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  mockExit.mockRestore();
});

// Mock ESM-only dependencies to avoid Jest ESM parsing issues
jest.mock('chalk', () => ({
  __esModule: true,
  default: {
    blue: (s: string) => s,
    green: (s: string) => s,
    red: (s: string) => s,
  },
}));

jest.mock('execa', () => ({
  __esModule: true,
  execa: jest.fn(() => Promise.resolve({ stdout: '' })),
}));

jest.mock('ora', () => ({
  __esModule: true,
  default: () => ({ start: () => ({ succeed: () => {}, fail: () => {} }) }),
}));
