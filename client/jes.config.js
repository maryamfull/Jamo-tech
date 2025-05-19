module.exports = {
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // optional: if using CSS imports
    },
  };
  