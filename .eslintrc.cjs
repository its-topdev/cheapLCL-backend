module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'func-names': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-return-await': 'off',
    'class-methods-use-this': 'off',
    camelcase: ['error', { properties: 'never' }],
    'no-promise-executor-return': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-throw-literal': 'error',
    'no-await-in-loop': 'off',
  },
};
