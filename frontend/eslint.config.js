import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'

export default [
  // Base JS and Vue rules
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  // Global relaxations to fit Nuxt auto-imports and template syntax
  {
    rules: {
      'no-undef': 'off',
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  // Global environment/globals for Nuxt, browser, and Node
  {
    languageOptions: {
      globals: {
        defineNuxtConfig: 'readonly',
        useState: 'readonly',
        defineNuxtPlugin: 'readonly',
        useRuntimeConfig: 'readonly',
        useNuxtApp: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        process: 'readonly',
        document: 'readonly',
        window: 'readonly',
        module: 'readonly',
        require: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
  // Vue SFC: ensure TypeScript is used for <script lang="ts">
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tsParser, ecmaVersion: 2022, sourceType: 'module' },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  // TypeScript and JS specific settings
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Allow Nuxt aliases and virtual modules
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
    },
  },
  // Allow dev-only imports in config file
  {
    files: ['eslint.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  // Ignore built output and external folders
  {
    ignores: ['node_modules', '.nuxt', '.output', 'dist', 'cms'],
  },
]
