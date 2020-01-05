module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  // testRunner: 'jest-circus/runner', // Not compatible with jest-allure
  transform: { '^.+\\.ts$': 'ts-jest' },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  testRegex: '(/tests/[^/]+)\\.ts$',
  verbose: true,
  setupFilesAfterEnv: ['jest-allure/dist/setup'],
  reporters: [
    'default',
    'jest-github-reporter',
    [
      'jest-stare',
      {
        resultDir: 'public/jest-stare',
        reportTitle: 'jest-stare!',
        coverageLink: '../coverage/lcov-report/index.html',
        jestStareConfigJson: 'jest-stare.json',
        jestGlobalConfigJson: 'globalStuff.json',
      },
    ],
    [
      'jest-html-reporters',
      {
        filename: 'public/jest-html-reporters.html',
        expand: true,
      },
    ],
  ],
  coverageDirectory: 'public/coverage',
};
