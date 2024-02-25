module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.google.json' }],
  },
};
