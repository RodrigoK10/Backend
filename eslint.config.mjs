export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: true,
        process: true,
        module: true,
        require: true,
        __dirname: true,
        window: true,
        document: true
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'off'
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.env',
      '*.config.js',
      'package-lock.json',
      'package.json'
    ]
  }
];

