const swc = require('@swc/core');
const pluginTransformEval = require('./plugins/transformEval.js');

module.exports = (code, features, mod) => {
  return swc.transformSync(code, {
    isModule: mod,
    sourceMaps: false,
    filename: 'input.js',

    plugin: pluginTransformEval,

    jsc: {
      target: 'es5',

      parser: {
        dynamicImport: true,
        privateMethod: true,
        functionBind: true,
        exportDefaultFrom: true,
        exportNamespaceFrom: true,
        decorators: true,
        decoratorsBeforeExport: true,
        topLevelAwait: true,
        importMeta: true
      },

      transform: {
        legacyDecorator: true
      },

      experimental: {
        keepImportAssertions: true
      }
    },

    module: {
      type: 'commonjs',
      strictMode: false,
      ignoreDynamic: true
    }
  }).code;
};