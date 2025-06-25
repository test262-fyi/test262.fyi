import fs from 'node:fs';
import { $ } from '../../cli.js';

const buildDir = process.env.HOME + '/webkit';
export default async () => {
  if (fs.existsSync('./jsc')) {
    const version = $(`git -C ${buildDir} rev-parse HEAD`).trim().slice(0, 7);
    return { version };
  }

  console.log('building webkit... (this will take a while)');
  $(`rm -rf ${buildDir}`);
  $(`git clone https://github.com/WebKit/WebKit.git ${buildDir} --depth=1`);
  const version = $(`git -C ${buildDir} rev-parse HEAD`).trim().slice(0, 7);

  $(`${buildDir}/Tools/Scripts/build-jsc --jsc-only --cmakeargs="-DUSE_64KB_PAGE_BLOCK=1"`);
  $(`cp -rf ${buildDir}/WebKitBuild/JSCOnly/Release ./jsc`);

  return { version };
};