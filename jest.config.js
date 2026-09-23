module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports/junit', outputName: 'junit.xml' }],
  ],
};
