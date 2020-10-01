const fs = require('fs');
const path = require('path');

function breakUp({ inDir, inFileName, outDir, cutSize }) {
  const inFilePath = fs.statSync(path.join(inDir, inFileName));

  const chunkCount = Math.ceil(file.size / cutSize);

  for (let i = 0; i < chunkCount; i++) {
    const readStream = fs.createReadStream(inFilePath, {
      start: i * cutSize,
      end: (i + 1) * cutSize,
    });

    const writeStream = fs.createWriteStream(
      path.join(outDir, `${inFileName}-${i}`),
      {
        flags: 'w',
      }
    );

    readStream.pipe(writeStream);
  }
}

function merge({ inDir, inFileName, mergeFilePath, count }) {
  for (let i = 0; i < count; i++) {
    const readStream = fs.createReadStream(
      path.join(inDir, `${inFileName}-${i}`)
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
