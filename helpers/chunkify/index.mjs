import { writeFileSync } from 'fs';
import { glob } from 'glob';

const amount = parseInt(process.argv[2] ?? 4);

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const files = (await glob('test262/test/**/*.js', {
  nodir: true
})).map(x => x.slice(8));

// shuffleArray(files);

const chunkLength = Math.ceil(files.length / amount);
const chunks = new Array(amount).fill(0).map((x, i) => files.slice(i * chunkLength, (i + 1) * chunkLength));

writeFileSync('chunks.json', JSON.stringify(chunks));

writeFileSync('time.txt', Date.now().toString());
