const transpile = require('./transpile.js');

module.exports = function (test) {
  try {
    test.contents = transpile(test.contents, test.attrs.features ?? [], !!test.attrs.flags.module);
  } catch (error) {
    console.error(error);
    test.result = {
      stderr: typeof error === 'string' ? error : `${error.name ?? 'SyntaxError'}: ${error.message ?? ''}\n`,
      stdout: '',
      error
    };
  }

  return test;
};