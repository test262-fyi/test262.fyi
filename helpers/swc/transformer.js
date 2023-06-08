// Jank hacks to inject polyfills :))
const { resolve } = require('path');
const { readFileSync } = require('fs');

const coreJsPath = resolve('../helpers/swc/node_modules/core-js-bundle/minified.js');
const coreJsContent = readFileSync(coreJsPath, 'utf8');

const polyfills = `[
  'Function(\\'this.globalThis = this;\\')()',
  ${JSON.stringify(coreJsContent)}
]`.replaceAll('\n', '');

module.exports = function (code, pass) {
  if (pass === 1) {
    code = code
      .replace('preludes: []', `preludes: polyfills`) // run polyfills in new realms
      .replace('print: print,', `print: print, exports: exports`);
  }

  if (pass === 2) {
    code = code
      .replace('require("vm");', // add polyfills var at the start
() => `require("vm");
var polyfills = ${polyfills};
`)
      .replace('vm.runInESHostContext(', // run polyfills in main
`
for (var i = 0; i < polyfills.length; i++) {
  vm.runInESHostContext(polyfills[i]);
}

vm.runInESHostContext(`)
        .replace('vm.createContext({', `vm.createContext({exports: exports, polyfills: polyfills,`);
  }

  return code;
};