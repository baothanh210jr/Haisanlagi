module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2022,
    extraFileExtensions: ['.vue']
  },
  rules: {
    // Nuxt aliases like ~/, @/ may not resolve in import rule
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // Template-specific adjustments (formatting handled by Prettier)
      }
    }
  ]
}