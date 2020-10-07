const path = require('path');
const { merge } = require('./lib');

const inDir = path.join(__dirname, '/output');
const outDir = path.join(__dirname, '/merge');
const outFile = 'bigFile.txt';
const inFile = 'bigFile';
const format = '.txt';

merge({
  inDir,
  outDir,
  outFile,
  inFile,
  format,
});
