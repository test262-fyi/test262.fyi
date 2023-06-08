const { readFileSync } = require('fs');

const getPackageVersion = package => JSON.parse(readFileSync(`helpers/swc/node_modules/${package}/package.json`), 'utf8').version;
const shortenVersion = version => version.split('.').slice(0, 2).join('.');

console.log(getPackageVersion('@swc/core'));
process.stdout.write(`(with core-js ${getPackageVersion('core-js-bundle')} on node 0.10.48)`);
