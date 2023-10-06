const HARNESS_CODE_REPLACEMENTS = [
  // Patch out unsupported for-in loop, see https://github.com/tc39/test262/pull/3908
  [
    `
function isEnumerable(obj, name) {
  var stringCheck = false;

  if (typeof name === "string") {
    for (var x in obj) {
      if (x === name) {
        stringCheck = true;
        break;
      }
    }
  } else {
    // skip it if name is not string, works for Symbol names.
    stringCheck = true;
  }

  return stringCheck &&
    Object.prototype.hasOwnProperty.call(obj, name) &&
    Object.prototype.propertyIsEnumerable.call(obj, name);
}
`,
    `
function isEnumerable(obj, name) {
  return (
    Object.prototype.hasOwnProperty.call(obj, name) &&
    Object.prototype.propertyIsEnumerable.call(obj, name)
  );
}
`,
  ],
  // Patch out unsupported template literals in compareArray.js
  [
    "`[${[].map.call(arrayLike, String).join(', ')}]`",
    "'[' + [].map.call(arrayLike, String).join(', ') + ']'",
  ],
  [
    "`First argument shouldn't be nullish. ${message}`",
    "'First argument shouldn\\'t be nullish. ' + message",
  ],
  [
    "`Second argument shouldn't be nullish. ${message}`",
    "'Second argument shouldn\\'t be nullish. ' + message",
  ],
  [
    "`Expected ${format(actual)} and ${format(expected)} to have the same contents. ${message}`",
    "'Expected ' + format(actual) + ' and ' + format(expected) + ' to have the same contents. ' + message",
  ],
  // Patch out unsupported template literals in promiseHelper.js
  ["`${message}: `", "message + ': '"],
  [
    "`${prefix}Settled values is an array`",
    "prefix + 'Settled values is an array'",
  ],
  [
    "`${prefix}The settled values has a different length than expected`",
    "prefix + 'The settled values has a different length than expected'",
  ],
  [
    "`${prefix}The settled value has a property status`",
    "prefix + 'The settled value has a property status'",
  ],
  ["`${prefix}status for item ${i}`", "prefix + 'status for item ' + i"],
  [
    "`${prefix}The fulfilled promise has a property named value`",
    "prefix + 'The fulfilled promise has a property named value'",
  ],
  [
    "`${prefix}The fulfilled promise has no property named reason`",
    "prefix + 'The fulfilled promise has no property named reason'",
  ],
  ["`${prefix}value for item ${i}`", "prefix + 'value for item ' + i"],
  [
    "`${prefix}Valid statuses are only fulfilled or rejected`",
    "prefix + 'Valid statuses are only fulfilled or rejected'",
  ],
  [
    "`${prefix}The fulfilled promise has no property named value`",
    "prefix + 'The fulfilled promise has no property named value'",
  ],
  [
    "`${prefix}The fulfilled promise has a property named reason`",
    "prefix + 'The fulfilled promise has a property named reason'",
  ],
  [
    "`${prefix}Reason value for item ${i}`",
    "prefix + 'Reason value for item ' + i",
  ],
  // Patch out unsupported template literals in $DONE() error messages
  [
    "`The promise should be resolved, but threw an exception: ${error.message}`",
    "'The promise should be resolved, but threw an exception: ' + error.message",
  ],
  [
    "`The promise should be rejected, but threw an exception: ${error.message}`",
    "'The promise should be rejected, but threw an exception: ' + error.message",
  ],
];

module.exports = function (code) {
  for (const [snippet, replacement] of HARNESS_CODE_REPLACEMENTS) {
    code = code.replace(snippet, replacement);
  }
  return code;
};
