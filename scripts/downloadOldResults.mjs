import { writeFileSync, mkdirSync, existsSync } from 'fs';

const { artifacts } = await (await fetch('https://api.github.com/repos/CanadaHonk/test262.fyi/actions/artifacts', { headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN }})).json();

if (!existsSync('results')) mkdirSync('results');
console.log(artifacts.map(x => x.name));

for (const { name, archive_download_url } of artifacts) {
  console.log('writing:', `results/${name}.zip`);
  writeFileSync(`results/${name}.zip`, Buffer.from(await (await fetch(archive_download_url, { headers: { Authorization: 'Bearer ' + process.env.GITHUB_TOKEN }})).arrayBuffer()))
}
