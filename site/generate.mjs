import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs';
// import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

const dataDir = 'site/data';
const results = {}, versions = {}, times = {};
let test262Rev = 'unknown';
let refTests = {};

for (const file of readdirSync('results')) {
  if (file === 'github-pages') continue;

  const base = join('results', file);

  results[file] = JSON.parse(readFileSync(join(base, 'results.json'), 'utf8'));
  refTests = results[file];

  console.log(`loaded ${results[file].length} results of ${file}`)

  if (existsSync(join(base, 'jsvu.json'))) {
    const jsvu = JSON.parse(readFileSync(join(base, 'jsvu.json'), 'utf8'));
    versions[file] = jsvu[Object.keys(jsvu).find(x => x !== 'os' && x !== 'engines')];
  }

  if (existsSync(join(base, 'esvu.json'))) {
    const esvu = JSON.parse(readFileSync(join(base, 'esvu.json'), 'utf8'));
    versions[file] = Object.values(esvu.installed)[0].version;
  }

  if (existsSync(join(base, 'time.txt'))) {
    times[file] = parseInt(readFileSync(join(base, 'time.txt'), 'utf8'));
  }

  if (existsSync(join(base, 'test262-rev.txt'))) {
    test262Rev = readFileSync(join(base, 'test262-rev.txt'), 'utf8');
  }
}

console.log(versions, times, test262Rev);
console.log(Object.keys(results));

mkdirSync(dataDir, { recursive: true });

writeFileSync(join(dataDir, 'engines.json'), JSON.stringify(versions));
writeFileSync(join(dataDir, 'times.json'), JSON.stringify({
  generatedAt: Date.now(),
  timeTaken: times
}));
writeFileSync(join(dataDir, 'test262.json'), JSON.stringify({
  revision: test262Rev
}));

console.log('loaded data');

let struct = new Map();
for (const test of refTests) {
  let y = struct;
  let path = [ 'test' ];

  for (const x of test.file.split('/').slice(1, -1)) {
    if (!y.has(x)) y.set(x, new Map());

    path.push(x);

    y = y.get(x);
    if (typeof y !== 'string') y.set('file', path.join('/'));
  }

  y.set(test.file.split('/').pop(), test);
}

console.log('generated structure');

const walkStruct = struct => {
  const walk = (x) => {
    let out = { total: 0, engines: {}, files: {} };
    const file = x.get('file') ?? 'index';
    console.log(file);
    const dataFile = join(dataDir, file.replace('test/', '') + '.json');

    for (const k of x.keys()) {
      if (k === 'file') continue;

      const y = x.get(k);

      if (y.result) {
        const niceFile = y.file.replace('test/', '');
        out.files[niceFile] = { total: 1, engines: {} };

        for (const engine of Object.keys(results)) {
          const pass = results[engine].find(z => z.file === y.file).result.pass;
          out.files[niceFile].engines[engine] = pass ? 1 : 0;

          if (pass) out.engines[engine] = (out.engines[engine] ?? 0) + 1;
        }

        out.total++;
        continue;
      }

      const file = y.get('file');
      const niceFile = file.replace('test/', '');
      const walkOut = walk(y);
      out.total += walkOut.total;

      for (const engine in walkOut.engines) {
        out.engines[engine] = (out.engines[engine] ?? 0) + walkOut.engines[engine];
      }

      out.files[niceFile] = {};
      for (const k in walkOut) {
        if (k === 'files') continue;
        out.files[niceFile][k] = walkOut[k];
      }

      /* for (const k in walkOut.files) {
        out.files[k] = walkOut.files[k];
      } */
    }

    if (file) {
      // console.log(dataFile, out);
      /* mkdir(dirname(dataFile), { recursive: true }).then(() => {
        writeFile(dataFile, JSON.stringify(out)).catch(err => console.log(err));
      }); */
      mkdirSync(dirname(dataFile), { recursive: true });
      writeFileSync(dataFile, JSON.stringify(out));
    }

    return out;
  };

  walk(struct);
};
walkStruct(struct);