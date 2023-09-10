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
    "'Expected ' + format(actual) + ' and ' + format(expected) +' to have the same contents. ' + message",
  ],
];

module.exports = function (code) {
  for (const [snippet, replacement] of HARNESS_CODE_REPLACEMENTS) {
    code = code.replace(snippet, replacement);
  }
  return code;
};
