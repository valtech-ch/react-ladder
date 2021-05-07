module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: [
    "build"
  ],
  extends: [
    '@valtech-ch/eslint-config/config/react',
    '@valtech-ch/eslint-config/rules/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    createDefaultProgram: true,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
  },
};
