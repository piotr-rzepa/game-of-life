module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    react: {
      rootDir: ['apps/*/', 'packages/*/']
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json']
      }
    }
  },
  rules: {
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function'
      }
    ],
    'react/destructuring-assignment': ['error', 'always'],
    'react/boolean-prop-naming': ['error', { rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+' }],
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off'
  },
  overrides: [
    {
      // Enable eslint-plugin-testing-library rules or preset only for matching files
      env: {
        jest: true
      },
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/?(*.)+(spec|test).[jt]s?(x)'] }]
      }
    }
  ],
  ignorePatterns: ['**/*.js', '**/*.json', 'node_modules', 'public', 'styles', 'coverage', 'dist', '.turbo', 'build']
};
