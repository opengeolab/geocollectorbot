module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  reporters: ['default', 'jest-junit'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/utils/testUtils.ts',
    '!src/index.ts',
  ],
}
