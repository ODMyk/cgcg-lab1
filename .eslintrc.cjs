module.exports = {
  root: true,
  extends: 'plugin:react/recommended',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
        '*.e2e.js',
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/tools.js',
      ],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['..*', './../*'],
                message: 'Please use absolute import with @ instead',
              },
            ],
          },
        ],
        'no-restricted-modules': [
          'error',
          {
            patterns: ['src/assets/images/*', 'src/assets/lottie/*'],
          },
        ],
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: [],
};
