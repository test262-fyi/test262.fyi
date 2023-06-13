import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync, cpSync, rmSync } from 'fs';
// import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

const dataDir = 'site/data';
const results = {}, versions = {}, times = {};
let test262Rev = 'unknown';
let refTests = {};

const chunkCount = parseInt(process.env.CHUNK_COUNT);

for (const dir of readdirSync('results')) {
  if (dir === 'github-pages' || dir === 'chunks') continue;

  const engine = dir.slice(0, -1);
  const chunk = dir.slice(-1);

  const base = join('results', dir);
  const out = join('results', engine);

  if (!existsSync(out)) mkdirSync(out);

  for (const file of readdirSync(base)) {
    cpSync(join(base, file), join(out, file), { force: true });
  }

  rmSync(base, { recursive: true, force: true });
}

for (const file of readdirSync('results')) {
  if (file === 'github-pages' || file === 'chunks') continue;

  const base = join('results', file);

  let validResults = 0;
  for (let i = 0; i < chunkCount; i++) {
    if (existsSync(join(base, `results${i}.json`))) {
      try {
        const readResults = JSON.parse(readFileSync(join(base, `results${i}.json`), 'utf8'));

        if (!results[file]) results[file] = [];
        results[file] = results[file].concat(readResults);

        validResults++;
      } catch {
        console.log(`failed to load results (${i}) of ${file}`);
      }
    }

    if (existsSync(join(base, `time${i}.txt`))) {
      const readTime = parseInt(readFileSync(join(base, `time${i}.txt`), 'utf8'));

      if (!times[file]) times[file] = 0;
      times[file] += readTime;
    }
  }

  if (validResults !== chunkCount) {
    console.log(`full results of ${file} is not done yet`);

    delete results[file];
    delete times[file];
    continue;
  }

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

  if (existsSync(join(base, 'version.txt'))) {
    versions[file] = readFileSync(join(base, 'version.txt'), 'utf8');
  }

  if (existsSync(join(base, 'test262-rev.txt'))) {
    test262Rev = readFileSync(join(base, 'test262-rev.txt'), 'utf8');
  }
}

const engines = Object.keys(results);
if (engines.length === 0) {
  console.log('no results! erroring');
  process.exit(1);
}

if (existsSync('results/github-pages/data/engines.json')) {
  const oldEngines = Object.keys(JSON.parse(readFileSync('results/github-pages/data/engines.json', 'utf8')));
  if (oldEngines.length === engines.length) {
    console.log('no new engines! erroring');
    process.exit(1);
  }
}

console.log(versions, times, test262Rev);
console.log(engines);

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

  const k = test.file.split('/').pop();
  if (!y.has(k)) y.set(k, []);

  y.get(k).push(test);
}

console.log('generated structure');

const fileResults = {};

for (const engine of engines) {
  if (!fileResults[engine]) fileResults[engine] = {};

  for (const x of results[engine]) {
    if (!fileResults[engine][x.file]) fileResults[engine][x.file] = [];
    fileResults[engine][x.file].push(x);
  }
}

const walkStruct = struct => {
  const walk = (x) => {
    let out = { total: 0, engines: {}, files: {} };
    const file = x.get('file') ?? 'index';
    // console.log(file);
    const dataFile = join(dataDir, file.replace('test/', '') + '.json');

    for (const k of x.keys()) {
      if (k === 'file') continue;

      const y = x.get(k);

      if (Array.isArray(y)) {
        const niceFile = y[0].file.replace('test/', '');

        out.files[niceFile] = { total: y.length, engines: {} };

        for (const test of y) {
          for (const engine of engines) {
            if (out.engines[engine] === undefined) out.engines[engine] = 0;
            if (out.files[niceFile].engines[engine] === undefined) out.files[niceFile].engines[engine] = 0;

            // const pass = results[engine].find(z => z.file === test.file && z.scenario === test.scenario).result.pass;
            const pass = fileResults[engine][test.file].find(z => z.scenario === test.scenario).result.pass;
            if (pass) out.files[niceFile].engines[engine]++;

            if (pass) out.engines[engine]++;
          }
        }

        out.total += y.length;
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

(async () => {
  const rawFeatures = await (await fetch(`https://raw.githubusercontent.com/tc39/test262/${test262Rev}/features.txt`)).text();
  const features = rawFeatures.split('\n').filter(x => x && x[0] !== '#').map(x => x.split('#')[0].trim());

  const featureResults = new Map(), featureDetails = new Map(), editionResults = {};

  const featureByEdition = new Map(Object.entries({
    "hashbang": 14,
    "Intl.Locale-info": 14,
    "FinalizationRegistry.prototype.cleanupSome": 14,
    "Intl.NumberFormat-v3": 14,
    "legacy-regexp": 14,
    "Atomics.waitAsync": 14,
    "import-assertions": 14,
    "json-modules": 14,
    "json-parse-with-source": 14,
    "resizable-arraybuffer": 14,
    "arraybuffer-transfer": 14,
    "Temporal": 14,
    "ShadowRealm": 14,
    "array-find-from-last": 14,
    "array-grouping": 14,
    "Intl.DurationFormat": 14,
    "regexp-v-flag": 14,
    "decorators": 14,
    "regexp-duplicate-named-groups": 14,
    "change-array-by-copy": 14,
    "Array.fromAsync": 14,
    "String.prototype.isWellFormed": 14,
    "String.prototype.toWellFormed": 14,
    "Intl-enumeration": 14,
    "Intl.DateTimeFormat-extend-timezonename": 14,
    "Intl.DisplayNames-v2": 14,
    "Intl.Segmenter": 14,
    "symbols-as-weakmap-keys": 14,
    "AggregateError": 12,
    "align-detached-buffer-semantics-with-web-reality": 12,
    "arbitrary-module-namespace-names": 13,
    "ArrayBuffer": 6,
    "Array.prototype.at": 13,
    "Array.prototype.flat": 10,
    "Array.prototype.flatMap": 10,
    "Array.prototype.includes": 7,
    "Array.prototype.values": 6,
    "arrow-function": 6,
    "async-iteration": 9,
    "async-functions": 8,
    "Atomics": 8,
    "BigInt": 11,
    "caller": 5,
    "class": 6,
    "class-fields-private": 13,
    "class-fields-private-in": 13,
    "class-fields-public": 13,
    "class-methods-private": 13,
    "class-static-block": 13,
    "class-static-fields-private": 13,
    "class-static-fields-public": 13,
    "class-static-methods-private": 13,
    "coalesce-expression": 11,
    "computed-property-names": 6,
    "const": 6,
    "cross-realm": 6,
    "DataView": 6,
    "DataView.prototype.getFloat32": 6,
    "DataView.prototype.getFloat64": 6,
    "DataView.prototype.getInt16": 6,
    "DataView.prototype.getInt32": 6,
    "DataView.prototype.getInt8": 6,
    "DataView.prototype.getUint16": 6,
    "DataView.prototype.getUint32": 6,
    "DataView.prototype.setUint8": 6,
    "default-parameters": 6,
    "destructuring-assignment": 6,
    "destructuring-binding": 6,
    "dynamic-import": 11,
    "error-cause": 13,
    "exponentiation": 7,
    "export-star-as-namespace-from-module": 11,
    "FinalizationRegistry": 12,
    "for-in-order": 11,
    "for-of": 6,
    "Float32Array": 6,
    "Float64Array": 6,
    "generators": 6,
    "globalThis": 11,
    "import.meta": 11,
    "Int8Array": 6,
    "Int16Array": 6,
    "Int32Array": 6,
    "intl-normative-optional": 8,
    "Intl.DateTimeFormat-datetimestyle": 12,
    "Intl.DateTimeFormat-dayPeriod": 8,
    "Intl.DateTimeFormat-formatRange": 12,
    "Intl.DateTimeFormat-fractionalSecondDigits": 12,
    "Intl.DisplayNames": 12,
    "Intl.ListFormat": 12,
    "Intl.Locale": 12,
    "Intl.NumberFormat-unified": 11,
    "Intl.RelativeTimeFormat": 11,
    "json-superset": 10,
    "let": 6,
    "logical-assignment-operators": 12,
    "Map": 6,
    "new.target": 6,
    "numeric-separator-literal": 12,
    "object-rest": 9,
    "object-spread": 9,
    "Object.fromEntries": 10,
    "Object.hasOwn": 13,
    "Object.is": 6,
    "optional-catch-binding": 10,
    "optional-chaining": 11,
    "Promise": 6,
    "Promise.allSettled": 11,
    "Promise.any": 12,
    "Promise.prototype.finally": 9,
    "Proxy": 6,
    "proxy-missing-checks": 6,
    "Reflect": 6,
    "Reflect.construct": 6,
    "Reflect.set": 6,
    "Reflect.setPrototypeOf": 6,
    "regexp-dotall": 9,
    "regexp-lookbehind": 9,
    "regexp-match-indices": 13,
    "regexp-named-groups": 9,
    "regexp-unicode-property-escapes": 9,
    "rest-parameters": 6,
    "Set": 6,
    "SharedArrayBuffer": 8,
    "string-trimming": 10,
    "String.fromCodePoint": 6,
    "String.prototype.at": 13,
    "String.prototype.endsWith": 6,
    "String.prototype.includes": 6,
    "String.prototype.matchAll": 11,
    "String.prototype.replaceAll": 12,
    "String.prototype.trimEnd": 10,
    "String.prototype.trimStart": 10,
    "super": 6,
    "Symbol": 6,
    "Symbol.asyncIterator": 9,
    "Symbol.hasInstance": 6,
    "Symbol.isConcatSpreadable": 6,
    "Symbol.iterator": 6,
    "Symbol.match": 6,
    "Symbol.matchAll": 11,
    "Symbol.prototype.description": 10,
    "Symbol.replace": 6,
    "Symbol.search": 6,
    "Symbol.species": 6,
    "Symbol.split": 6,
    "Symbol.toPrimitive": 6,
    "Symbol.toStringTag": 6,
    "Symbol.unscopables": 6,
    "tail-call-optimization": 6,
    "template": 6,
    "top-level-await": 13,
    "TypedArray": 6,
    "TypedArray.prototype.at": 13,
    "u180e": 7,
    "Uint8Array": 6,
    "Uint16Array": 6,
    "Uint32Array": 6,
    "Uint8ClampedArray": 6,
    "WeakMap": 6,
    "WeakRef": 12,
    "WeakSet": 6,
    "well-formed-json-stringify": 10,
  }).concat([ ["__proto__", 6], ["__getter__", 8], ["__setter__", 8] ]));

  let info = {};
  for (const line of rawFeatures.split('process-document')[1].split('## Standard')[0].split('\n').filter(x => x)) {
    if (line.startsWith('# https://github.com')) {
      const repo = line.split('github.com/tc39/')[1].replace('/', '').trim();

      let spec = await (await fetch(`https://raw.githubusercontent.com/tc39/${repo}/HEAD/spec.html`)).text();
      if (spec === '404: Not Found' || spec.includes('stage: -1')) spec = await (await fetch(`https://raw.githubusercontent.com/tc39/${repo}/HEAD/spec.emu`)).text();
      if (spec === '404: Not Found' || spec.includes('stage: -1')) spec = await (await fetch(`https://raw.githubusercontent.com/tc39/${repo}/HEAD/README.md`)).text();

      info.name = spec.match(/(title:|#) (.*)/i)?.[2];
      info.stage = parseInt(spec.match(/stage:? ([0-9])/i)?.[1]);
      info.link = `https://github.com/tc39/${repo}`;

      if (!process.env.GITHUB_TOKEN) continue; // skip if no GITHUB_TOKEN in env to avoid rate limiting people
      const repoInfo = await (await fetch(`https://api.github.com/repos/tc39/${repo}`, { headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN }})).json();
      if (!repoInfo.stargazers_count) continue;

      info.description = repoInfo.description;
      info.stars = repoInfo.stargazers_count;
      info.lastUpdated = repoInfo.updated_at;
    }

    if (!line.startsWith('#')) {
      if (info.name) featureDetails.set(line.trim(), info);
      info = {};
    }
  }

  for (const feature of features) {
    const detail = featureDetails.get(feature);
    const edition = featureByEdition.get(feature);
    console.log(feature, edition, detail);

    if (detail && !featureResults.has(feature)) featureResults.set(feature, { total: 0, engines: {}, proposal: detail });

    const r = !detail ? { total: 0, engines: {} } : featureResults.get(feature);

    let tests = [];
    for (const test of refTests) {
      if (test.attrs && test.attrs.features && test.attrs.features.includes(feature)) {
        tests.push(test);
        r.total++;

        if (!editionResults[edition]) editionResults[edition] = { total: 0, engines: {} };
        editionResults[edition].total++;
      }
    }

    for (const engine of engines) {
      for (const test of tests) {
        if (r.engines[engine] === undefined) r.engines[engine] = 0;
        if (editionResults[edition].engines[engine] === undefined) editionResults[edition].engines[engine] = 0;

        const pass = fileResults[engine][test.file].find(z => z.scenario === test.scenario).result.pass;
        if (pass) {
          r.engines[engine]++;
          editionResults[edition].engines[engine]++;
        }
      }
    }
  }

  writeFileSync(join(dataDir, 'features.json'), JSON.stringify(Object.fromEntries(featureResults)));
  writeFileSync(join(dataDir, 'editions.json'), JSON.stringify(editionResults));
})();
