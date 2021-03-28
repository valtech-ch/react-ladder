module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '@valtech-ch/eslint-config/config/react',
    '@valtech-ch/eslint-config/rules/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
  },
};
