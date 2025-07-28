import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  {
    ignores: [
      '**/node_modules',
      '**/build',
      '**/dist',
      '**/out',
      'eslint.config.mjs',
      'electron.vite.config.ts',
    ],
  },
  tseslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      semi: ['error', 'always'],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  // Configuration for main and preload files (Node.js environment)
  {
    files: [
      'src/main/**/*.ts',
      'src/preload/**/*.ts',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Configuration for renderer files (Web environment)
  {
    files: [
      'src/renderer/**/*.ts',
      'src/renderer/**/*.tsx',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.web.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
