require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
});

const Kiwi = require('./translate.ts');

module.exports = Kiwi;