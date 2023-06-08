// Jank hacks to inject polyfills :))
const { resolve } = require('path');
const coreJs = resolve('../babel-test262-runner/node_modules/core-js-bundle/index.js');

// TODO: would inlining these files instead of reads each test be faster?
const polyfills = `[
  'Function(\\'this.globalThis = this;\\')()',
  fs.readFileSync('${coreJs.replaceAll('\\', '\\\\')}', 'utf8')
]`.replaceAll('\n', '');

module.exports = function (code, pass) {
  if (pass === 1) {
    code = code
      .replace('preludes: []', `preludes: ${polyfills}`) // run polyfills in new realms
      .replace('print: print,', `print: print, exports: exports`);
  }

  if (pass === 2) {
    code = code
      .replace('vm.runInESHostContext(', // run polyfills in main
`
var fs = require("fs");
var polyfills = ${polyfills};
for (var i = 0; i < polyfills.length; i++) {
  vm.runInESHostContext(polyfills[i]);
}

vm.runInESHostContext(`.replaceAll('\n', ''))
        .replace('vm.createContext({', `vm.createContext({exports: exports, `);
  }

  // console.error(code);
  return code;
};