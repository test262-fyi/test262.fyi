const sucrase = require('sucrase');

/*
  sucrase notes:
  - always uses strict mode (and modules?)
  - does not throw on bad syntax (?)

  it is not really made for this (es5), but test anyway for fun/curiosity
*/

module.exports = function (test) {
  try {
    test.contents = sucrase.transform(test.contents, { transforms: [] }).code;
  } catch (error) {
    test.result = {
      stderr: `${error.name}: ${error.message}\n`,
      stdout: '',
      error
    };
  }

  return test;
};