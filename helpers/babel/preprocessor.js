// Wrap Babel's test262 runner transpiler to work nicely with test262-harness
const transpile = require('../../babel-test262-runner/lib/run-tests/transpile.js');

module.exports = function (test) {
  try {
    test.contents = transpile(test.contents, test.attrs.features ?? [], !!test.attrs.flags.module);
  } catch (error) {
    test.result = {
      stderr: `${error.name}: ${error.message}\n`,
      stdout: '',
      error
    };
  }

  return test;
};