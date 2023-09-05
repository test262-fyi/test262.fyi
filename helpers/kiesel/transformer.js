const HARNESS_IS_ENUMERABLE = `
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
`;

const HARNESS_IS_ENUMERABLE_TRANSFORMED = `
function isEnumerable(obj, name) {
  return (
    Object.prototype.hasOwnProperty.call(obj, name) &&
    Object.prototype.propertyIsEnumerable.call(obj, name)
  );
}
`;

module.exports = function (code) {
  // Patch out unsupported for-in loop, see https://github.com/tc39/test262/pull/3908
  code = code.replace(HARNESS_IS_ENUMERABLE, HARNESS_IS_ENUMERABLE_TRANSFORMED);
  return code;
};
