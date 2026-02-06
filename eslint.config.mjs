import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    ignores: ['**/node_modules/**', '**/target/**', 'eslint.config.js'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      react,
      prettier,
      import: importPlugin,
    },
    settings: {
      react: {
        pragma: 'h',
      },
    },
    rules: {
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': 0,
      'react/prop-types': 0,
      'react/no-string-refs': 0,
      'react/react-in-jsx-scope': 0,
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          proseWrap: 'always',
          trailingComma: 'all',
          bracketSpacing: true,
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          endOfLine: 'auto',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-undef': 0,
      'no-unused-vars': 0,
      'prefer-const': 0,
      'dot-notation': 0,
      'vars-on-top': 0,
      'default-case': 0,
      'consistent-return': 0,
      'default-param-last': 0,
      'no-restricted-globals': 0,
      'class-methods-use-this': 0,
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'no-var': 0,
      'no-void': 0,
      'no-shadow': 0,
      'no-console': 0,
      'no-extra-semi': 0,
      'no-throw-literal': 0,
      'no-param-reassign': 0,
      'no-nested-ternary': 0,
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
      'no-restricted-exports': 0,
      'no-unused-expressions': 0,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/require-await': 0,
      '@typescript-eslint/unbound-method': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-misused-promises': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-floating-promises': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-unnecessary-type-assertion': 0,
      '@typescript-eslint/restrict-template-expressions': 0,
    },
  },
];
