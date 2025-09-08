import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'prettier',
    'eslint:recommended',
    'next'
  ),
  {
    // plugins: {
    //   'simple-import-sort': simpleImportSort,
    // },

    rules: {
      // 'sort-imports': [
      //   'warn',
      //   {
      //     ignoreDeclarationSort: true,
      //   },
      // ],
      // 'simple-import-sort/imports': 'warn',
      // 'simple-import-sort/exports': 'warn',

      'no-unused-vars': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'warn',
    },
  },
];

export default eslintConfig;
