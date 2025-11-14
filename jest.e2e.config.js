module.exports = {
  ...require('./jest.config.js'),
  testMatch: ['**/__tests__/e2e/**/*.test.ts'],
  testTimeout: 60000,
};