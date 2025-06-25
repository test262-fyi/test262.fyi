import fs from 'node:fs';
import { $ } from '../../utils.js';

const buildDir = process.env.HOME + '/boa';
export default async () => {
  console.log('building boa... (this will take a while)');
  $(`rm -rf ${buildDir}`);
  $(`git clone https://github.com/boa-dev/boa.git ${buildDir} --depth=1`);
  const version = $(`git -C ${buildDir} rev-parse HEAD`).trim().slice(0, 7);

  $(`cd ${buildDir} && cargo build --release`);
  $(`cp -f ${buildDir}/target/release/boa ./boa`);
  $(`rm -rf ${buildDir}`);

  return { version };
};