const path = require('path');
const { breakUp } = require('./lib');

const outDir = path.join(__dirname, '/output');
const inDir = path.join(__dirname, '/input');
const inFileName = 'bigFile.txt';

breakUp({
  inDir,
  inFileName,
  outDir,
  cutSize,
});
