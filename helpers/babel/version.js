const { readFileSync } = require('fs');

const packages = {
  babel: '@babel/core',
  'core-js': 'core-js-bundle'
};

const getPackageVersion = package => JSON.parse(readFileSync(`babel-test262-runner/node_modules/${package}/package.json`), 'utf8').version;

let out = [];
for (const name in packages) {
  out.push(`${name} ${getPackageVersion(packages[name])}`);
}

console.log(out.join(' + '));