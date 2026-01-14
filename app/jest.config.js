/** @type {import('jest').Config} */
export default {
    // Use ts-jest preset for TypeScript support
    preset: 'ts-jest',

    // Set the test environment to Node.js
    testEnvironment: 'node',

    // Set NODE_ENV to test
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Define file extensions Jest will look for
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Transform TypeScript files with ts-jest
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },

    // Test file patterns
    testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],

    // Coverage configuration
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/types/**'],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },

    // Setup files
    setupFilesAfterEnv: [],

    // Clear mocks between tests
    clearMocks: true,

    // Verbose output
    verbose: true,
};
