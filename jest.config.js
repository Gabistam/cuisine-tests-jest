module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageReporters: ['text', 'html'],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  verbose: true
};
