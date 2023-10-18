/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['build'],
    coverageReporters: ['clover', 'json-summary', 'lcov', ['text', { skipFull: true }]],
    coveragePathIgnorePatterns: [
        'src/app.ts',
        'src/services/authentication',
        'src/support/helpers/swaggerGenerator.ts',
    ],
    rootDir: './',
    modulePaths: ['<rootDir>'],
    setupFiles: ['<rootDir>/test/support/environmentVariables.js', '<rootDir>/test/support/globalSetup.js'],
    globalTeardown: '<rootDir>/test/support/globalTeardown.js',
};
