const fs = require('fs');
const path = require('path');

const LENGTH = 10;

function breakUp(inFilePath, outDir) {
  const file = fs.statSync(inFilePath);

  const chunkSize = Math.ceil(file.size / LENGTH);

  for (let i = 0; i < LENGTH; i++) {
    const readStream = fs.createReadStream(
      path.join('./input', 'bigFile.txt'),
      {
        start: i * chunkSize,
        end: (i + 1) * chunkSize,
      }
    );

    const writeStream = fs.createWriteStream(
      path.join(outDir, `bigFile${i}.txt`),
      {
        flags: 'w',
      }
    );

    readStream.pipe(writeStream);
  }
}

function merge(outDir, mergeFilePath) {
  for (let i = 0; i < LENGTH; i++) {
    const readStream = fs.createReadStream(
      path.join(outDir, `bigFile${i}.txt`)
    );

    const writeStream = fs.createWriteStream(mergeFilePath, {
      flags: 'a',
    });

    readStream.pipe(writeStream);
  }
}

module.exports = {
  breakUp,
  merge,
};
