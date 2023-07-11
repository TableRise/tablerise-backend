/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['build'],
  coveragePathIgnorePatterns: [
    'src/app.ts',
    'test/connectDatabaseTest.ts'
  ],
  rootDir: './',
  modulePaths: ['<rootDir>']
}
