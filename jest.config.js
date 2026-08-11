module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    // deploy/ is a copy of assets/ produced by build.sh, so without this every
    // suite is discovered and run twice.
    testPathIgnorePatterns: ['/node_modules/', '/deploy/'],
    setupFiles: ['<rootDir>/jest.setup.js'],
};