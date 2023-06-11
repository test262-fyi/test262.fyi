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

  let results = 0;
  for (let i = 0; i < chunkCount; i++) {
    if (existsSync(join(base, `results${i}.json`))) {
      try {
        const readResults = JSON.parse(readFileSync(join(base, 'results.json'), 'utf8'));

        if (!results[file]) results[file] = [];
        results[file] = results[file].concat(readResults);

        results++;
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

  if (results !== chunkCount) {
    console.log(`full results of ${file} is not done yet`);
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
  console.log('no results! exiting');
  process.exit(0);
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

  const featureResults = new Map(), featureDetails = new Map();

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
    if (!detail) continue; // skip non-proposals as we do not need that info for now
    console.log(feature, detail);

    if (!featureResults.has(feature)) featureResults.set(feature, { total: 0, engines: {}, proposal: detail });

    const r = featureResults.get(feature);

    let tests = [];
    for (const test of refTests) {
      if (test.attrs && test.attrs.features && test.attrs.features.includes(feature)) {
        tests.push(test);
        r.total++;
      }
    }

    for (const engine of engines) {
      for (const test of tests) {
        if (r.engines[engine] === undefined) r.engines[engine] = 0;

        const pass = fileResults[engine][test.file].find(z => z.scenario === test.scenario).result.pass;
        if (pass) r.engines[engine]++;
      }
    }
  }

  writeFileSync(join(dataDir, 'features.json'), JSON.stringify(Object.fromEntries(featureResults)));
})();
