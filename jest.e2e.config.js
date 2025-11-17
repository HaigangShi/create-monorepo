const base = require('./jest.config.js');

module.exports = {
  ...base,
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^execa$': '<rootDir>/src/__tests__/e2e/execa-wrapper.ts',
  },
  testMatch: ['**/__tests__/e2e/**/*.test.ts'],
  testTimeout: 60000,
};