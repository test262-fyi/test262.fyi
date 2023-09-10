const swc = require('@swc/core');
const pluginTransformEval = require('./plugins/transformEval.js');
const packageJson = require('./package.json');

module.exports = (code, features, mod) => {
  return swc.transformSync(code, {
    isModule: mod,
    sourceMaps: false,
    filename: 'input.js',

    // SWC JS plugins break at >1.3.6 and owner refuses to fix themselves :))
    plugin: packageJson.dependencies['@swc/core'] === '1.3.6' ? pluginTransformEval : undefined,

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
        // keepImportAssertions: true
        keepImportAttributes: true
      }
    },

    module: {
      type: 'commonjs',
      strictMode: false,
      ignoreDynamic: true
    }
  }).code;
};