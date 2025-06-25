import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { $ } from '../../cli.js';

export default async () => {
  $('mkdir -p ./porffor/node_modules');
  $('npm install --prefix ./porffor porffor@latest');

  return {
    version: $('node ./porffor/node_modules/porffor/runtime/index.js --version').trim(),
    preludes: (await (await fetch('https://raw.githubusercontent.com/CanadaHonk/porffor/main/test262/harness.js')).text()).split('///').reduce((acc, x) => {
      const [ k, ...content ] = x.split('\n');
      acc[k.trim()] = content.join('\n').trim() + '\n';
      return acc;
    }, {})
  };
};