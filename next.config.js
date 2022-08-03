const withTM = require('next-transpile-modules')([
  '@trustlines/trustlines-clientlib',
]);

module.exports = withTM({});
