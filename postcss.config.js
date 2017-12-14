const pCSSNext = require('postcss-cssnext')({ warnForDuplicates: false });
const pCSSImport = require('postcss-import');
const pCSSNested = require('postcss-nested');

module.exports = {
  plugins: [pCSSImport, pCSSNext, pCSSNested],
};
