const path = require('path');
const { merge } = require('./lib');

const mergeFilePath = path.join(__dirname, '/merge', 'bigFile.txt');
const inDir = path.join(__dirname, '/input');
const inFileName = 'bigFile.txt';
const count = 10;
merge({ inDir, inFileName, mergeFilePath, count });
