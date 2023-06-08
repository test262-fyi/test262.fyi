const { readFileSync } = require('fs');

const packages = {
  babel: '@babel/core',
  'core-js': 'core-js-bundle'
};

const getPackageVersion = package => JSON.parse(readFileSync(`babel-test262-runner/node_modules/${package}/package.json`), 'utf8').version;
const shortenVersion = version => version.split('.').slice(0, 2).join('.');

let out = [];
for (const name in packages) {
  out.push(`${name} ${shortenVersion(getPackageVersion(packages[name]))}`);
}
out.push('node 0.10');

console.log(out.join(' + ').replace('babel ', ''));