module.exports = {
  ...require('config/eslint-express'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
};
