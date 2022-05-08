module.exports = {
  ...require('config/eslint-react'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
};
