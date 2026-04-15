import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
        runtime: 'automatic',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,

      // Turn off the rule that requires React to be in scope (React 17+ JSX transform)
      'react/react-in-jsx-scope': 'off',

      // Formatting rules
      'indent': ['warn', 2], // 2 space indentation (maybe 4?)
      'quotes': ['warn', 'double'], // double quotes
      'semi': ['warn', 'always'], // semicolons
      'comma-dangle': ['warn', 'always-multiline'], // trailing commas
      'object-curly-spacing': ['warn', 'always'], // spaces in curly braces

      // TypeScript-specific rules
      '@typescript-eslint/no-explicit-any': ['warn'], // Warn about 'any' type
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }], // Warn on unused variables (allow prefixed with _)

      'no-unused-vars': 'off', // Disable base rule, use TypeScript version instead
      'react/prop-types': 'off', // Disable prop-types rule because TypeScript handles type checking
    },
  }
)