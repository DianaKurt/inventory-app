import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  // Ignore generated / vendor folders
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'client/public/**',
      // prisma is mostly generated / migrations; keep it out of lint
      'server/prisma/**',
    ],
  },

  // Base JS recommendations
  js.configs.recommended,

  // TypeScript (non-typechecked) recommendations
  ...tseslint.configs.recommended,

  // Common TS/JS rules + plugins
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    settings: {
      // Let eslint-plugin-import resolve TS paths
      'import/resolver': {
        typescript: {
          project: ['client/tsconfig.json', 'server/tsconfig.json'],
        },
      },
    },
    rules: {
      // Prefer removing unused imports automatically via eslint --fix
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Catch circular deps & unused exports (best-effort; can be noisy early)
      'import/no-cycle': ['warn', { maxDepth: 20, ignoreExternal: true }],
      'import/no-unused-modules': [
        'warn',
        {
          unusedExports: true,
          // Keep this off for now unless you want CI to fail on it:
          missingExports: false,
        },
      ],
    },
  },

  // Client: browser globals
  {
    files: ['client/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Server: node globals
  {
    files: ['server/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: globals.node,
    },
  },
]