module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
     // 'plugin:jsdoc/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
    'jsdoc',
    'prettier'
    
  ],
  'rules': {
    'react/prop-types': 0,
    'jsdoc/check-syntax': 1,
    // 'indent': 'off',
    // '@typescript-eslint/indent': ['error', 2]
  },
  'ignorePatterns': ['**/*.js', '**/*.jsx'],
};
