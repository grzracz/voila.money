const path = require('path');

module.exports = {
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  indentation: 2,
  input: path.join(__dirname, 'core/**/*.{ts,tsx}'),
  locales: ['en', 'es', 'pl'],
  output: path.join(__dirname, 'core/locales/$LOCALE.json'),
  sort: false,
  useKeysAsDefaultValue: true,
};
