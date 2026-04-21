import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx,mts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
      import: importPlugin,
    },
    settings: {
      react: {
        pragma: 'h',
        version: 'detect',
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: 'main/**', group: 'internal' },
            { pattern: 'ui/**', group: 'internal' },
            { pattern: 'components/**', group: 'internal', position: 'after' },
            { pattern: 'shared/**', group: 'internal' },
            { pattern: 'cli/**', group: 'internal' },
          ],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['type'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          proseWrap: 'always',
          trailingComma: 'all',
          bracketSpacing: true,
          singleQuote: true,
          semi: true,
          printWidth: 100,
          tabWidth: 2,
          endOfLine: 'auto',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/target/**'],
  },
);
