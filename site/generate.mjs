const makeRow = (test, name = test, depth = 0, clas = test.split('/')) => {
  console.log(`${currentStruct++}/${totalStruct} ${test}`);
  // if (depth > 1) return '';

  return `
<tr class="${clas.join(' ')} ${depth > 0 ? 'hidden' : ''}">
<th>${name}</th>
<td>${buildGraph(test)}</td>
</tr>

${Object.values(deep(struct, test.split('/'))).map(x => typeof x === 'object' && x.file ? makeRow(x.file.replace('test/', ''), x.file.replace('test/', ''), depth + 1, x.file.replace('test/', '').split('/')) : '').join('\n')}`;
};

const makeTable = struct => `<table>
<tbody>
${Object.keys(struct).flatMap(x => [
  makeRow(x, x),
  // ...Object.keys(names).map()
  // ...Object.keys(methods[x].parameters ?? {}).map(y => makeRow(methods[x].parameters[y], y, true))
]).join('\n')}
</tbody>
</table>`;

const names = {
  v8: 'V8',
  sm: 'SpiderMonkey',
  jsc: 'JavaScriptCore',
  hermes: 'Hermes',
  chakra: 'ChakraCore',
  qjs: 'QuickJS',
  libjs: 'LibJS',
  graaljs: 'GraalJS',
  xs: 'XS',
  engine262: 'engine262'
};
const results = {};
let refTests = {};

const makeGraph = (data, clas = '') => {
  const keys = Object.keys(data);
  return `<div class="stats ${clas}">
<div>
${keys.reverse().map(x => x === 'total' ? '' : `<div class="stat-${x}" style="width: ${((data[x] / data.total) * 100) / (keys.length - 1)}%"><b>${names[x]}</b> ${((data[x] / data.total) * 100).toFixed(0)}%</div>`).join('\n')}
</div>
</div>`
};

const buildGraph = test => {
  const data = {};
  const file = 'test/' + test;
  for (const engine of Object.keys(results)) {
    if (test.endsWith('.js')) data[engine] = results[engine].find(x => x.file === file).result.pass ? 1 : 0;
      else data[engine] = results[engine].reduce((acc, x) => x.file.startsWith(file) && x.result.pass ? acc + 1 : acc, 0);
  }

  if (test.endsWith('.js')) data.total = 1;
    else data.total = refTests.reduce((acc, x) => x.file.startsWith(file) ? acc + 1 : acc, 0);

  return makeGraph(data);
};

import { readFileSync, readdirSync, writeFileSync } from 'fs';

const template = readFileSync('site/template.html', 'utf8');

for (const file of readdirSync('results')) {
  results[file] = JSON.parse(readFileSync('./results/' + file + '/results.json', 'utf8'));
  refTests = results[file];
}

const deep = (obj, arr) => {
  let out = obj;
  for (const x of arr) {
    out = out[x];
  }
  // console.log(arr, Object.values(out).length);
  return out;
};

let struct = {};
for (const test of refTests) {
  let y = struct;
  let path = [ 'test' ];

  for (const x of test.file.split('/').slice(1, -1)) {
    if (x === '__proto__' && y[x].__proto__ === null) y[x] = {};

    y[x] = (y[x] ?? {});

    path.push(x);
    if (typeof y[x] !== 'string') y[x].file = path.join('/');

    y = y[x];
  }

  y[test.file.split('/').pop()] = test;
}

const totalStruct = (() => {
  let total = 0;
  const walk = x => {
    for (const y in x) {
      if (x[y].file) {
        total++;
        if (!y.result) walk(x[y]);
      }
    }
  };

  walk(struct);

  return total;
})();
let currentStruct = 1;

// console.log(struct);

writeFileSync('site/index.html', template
  .replace('_content_', makeTable(struct))
  .replace('_overall_', buildGraph('')));