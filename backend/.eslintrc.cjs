module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended'
  ],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', { code: 100 }],
    'quotes': ['error', 'single'],
    'no-console': 'warn',
    'no-var': 'error',
    'import/no-unresolved': 'error',
  },
}
