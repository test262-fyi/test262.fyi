import { writeFileSync, mkdirSync, existsSync } from 'fs';

const engines = [ 'v8', 'sm', 'jsc', 'chakra', 'graaljs', 'hermes', 'kiesel', 'libjs', 'engine262', 'qjs', 'xs', 'nashorn', 'rhino', 'babel', 'swc' ];

const { artifacts } = await (await fetch('https://api.github.com/repos/CanadaHonk/test262.fyi/actions/artifacts', { headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN }})).json();

if (!existsSync('results')) mkdirSync('results');

for (const engine of engines) {
  const artifact = artifacts.find(x => x.name === engine);
  if (!artifact || existsSync(`results/${engine}`)) continue;

  writeFileSync(`results/${engine}.zip`, Buffer.from(await (await fetch(`https://api.github.com/repos/CanadaHonk/test262.fyi/actions/artifacts/${artifact.id}/zip`, { headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN }})).arrayBuffer()))
}