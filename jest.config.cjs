module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 10000, // 10 seconds global timeout for all tests
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
