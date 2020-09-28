const path = require('path');
const { merge } = require('./lib');

const outDir = path.join(__dirname, '/output');
const mergeFilePath = path.join(__dirname, '/merge', 'bigFile.txt');

merge(outDir, mergeFilePath);
