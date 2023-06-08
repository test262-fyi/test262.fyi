// Jank hacks to inject polyfills :))
const { resolve } = require('path');
const coreJs = resolve('../babel-test262-runner/node_modules/core-js-bundle/index.js');
const regenerator = resolve('../babel-test262-runner/node_modules/regenerator-runtime/runtime.js');

// TODO: would inlining these files instead of reads each test be faster?
const polyfills = `[
  'Function("this.globalThis = this;")()',
  fs.readFileSync(${JSON.stringify(coreJs)}, "utf8"),
  fs.readFileSync(${JSON.stringify(regenerator)}, "utf8")
]`.replaceAll('\n', '');

module.exports = function (code) {
  code = code
    .replace('preludes: []', `preludes: ${polyfills.replaceAll('"', '\\"')}`) // run polyfills in new realms
    .replace('vm.runInESHostContext(', // run polyfills in main
`
var fs = require("fs");
var polyfills = ${polyfills};
for (var i = 0; i < polyfills.length; i++) {
  vm.runInESHostContext(polyfills[i]);
}

vm.runInESHostContext(`.replaceAll('\n', ''))
  .replace('require: require,', `require: require, exports: exports,`)
  .replace('vm.createContext({', `vm.createContext({
  exports: exports,
`.replaceAll('\n', ''));
  // console.error(code);
  return code;
};