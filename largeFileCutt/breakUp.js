const path = require('path');
const { breakUp } = require('./lib');

const outDir = path.join(__dirname, '/output');
const inDir = path.join(__dirname, './input');
const inFile = 'bigFile.txt';

breakUp({
  inDir,
  inFile,
  outDir,
  cutSize: 1024 * 150,
}).then(chunkCount => {
  console.log(chunkCount);
});
