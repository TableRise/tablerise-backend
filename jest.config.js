/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['build'],
    coverageReporters: ['clover', 'json-summary', 'lcov', ['text', { skipFull: true }]],
    coveragePathIgnorePatterns: ['src/app.ts', 'src/services/authentication'],
    rootDir: './',
    modulePaths: ['<rootDir>'],
    setupFiles: ['<rootDir>/test/support/environmentVariables.js'],
};
