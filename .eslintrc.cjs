module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [],
  rules: {
    'no-console': 'warn',
    'func-names': 'off',
    'spaced-comment': 'off',
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'err|req|res|next|val' }],
    'import/extensions': ['error', 'always', { ignorePackages: true }],
  },
};
