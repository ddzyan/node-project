const path = require('path');
const { breakUp } = require('./lib');

const outDir = path.join(__dirname, '/output');
const inFilePath = path.join(__dirname, './input/bigFile.txt');

breakUp(inFilePath, outDir);
