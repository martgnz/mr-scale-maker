/* eslint-disable import/no-extraneous-dependencies  */
const pCSSEnv = require('postcss-preset-env');
const pCSSImport = require('postcss-import');
const pCSSNested = require('postcss-nested');

module.exports = {
  plugins: [
    pCSSImport,
    pCSSEnv({
      features: {
        'custom-properties': {
          preserve: false,
        },
      },
    }),
    pCSSNested,
  ],
};
