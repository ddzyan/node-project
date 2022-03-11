const fs = require('fs');
const path = require('path');

/**
 * @description 切割文件
 * @param {object} param0
 * @param {string} param0.inDir 输入文件文件夹路径
 * @param {string} param0.inFile 切割文件
 * @param {string} param0.outDir 输出文件夹路径
 * @param {string} param0.cutSize 切割文件大小
 * @returns {Promise<number>} chunkCount
 */
function breakUp({ inDir, inFile, outDir, cutSize }) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inDir)) {
      console.error('输入文件夹不存在');
      reject(new Error('inDir is not exist'));
    }
    if (!fs.existsSync(outDir)) {
      console.log('创建输出文件夹', outDir);
      fs.mkdirSync(outDir);
    }

    cutSize = Math.ceil(cutSize); // 向上取整

    const inFilePath = path.join(inDir, inFile);
    let format = '';
    let fileName = inFile;
    if (inFile.includes('.')) {
      fileName = inFile.split('.')[0];
      format = path.extname(inFile);
    }
    // 获取文件格式

    console.log('正在切割的文件', inFile);

    let chunkCount = 0;

    const readStream = fs.createReadStream(inFilePath, {
      highWaterMark: cutSize, // 设置缓存区大小
    });

    readStream.on('data', chunk => {
      fs.writeFileSync(
        path.join(outDir, `${fileName}-${chunkCount}${format}`),
        chunk
      );
      chunkCount++;
    });

    readStream.on('end', () => {
      resolve(chunkCount);
    });

    readStream.on('err', err => {
      console.error('切割失败', err);
      reject(err);
    });
  });
}

/**
 *
 * @param {object} param0
 * @param {string} param0.inDir 输入文件夹路径
 * @param {string} param0.outDir 输出文件夹路径
 * @param {string} param0.outFile 输出文件名称
 * @param {string} param0.inFile 输入的文件名称
 * @param {string} param0.format 文件格式
 * @returns {void}
 */
function merge({ inDir, outDir, outFile, inFile, format }) {
  if (!fs.existsSync(outDir)) {
    console.log('创建输出文件夹', outDir);
    fs.mkdirSync(outDir);
  }

  const files = fs.readdirSync(inDir);
  console.log('输入的文件总数', files.length);

  const outFilePath = path.join(outDir, outFile);
  for (let i = 0; i < files.length; i++) {
    const inFilePath = path.join(inDir, `${inFile}-${i}${format}`);
    console.log('输入文件', inFilePath);
    const fsBuffer = fs.readFileSync(inFilePath);
    fs.writeFileSync(outFilePath, fsBuffer, {
      flag: 'a', // 追加方式
    });
  }
}
module.exports = {
  breakUp,
  merge,
};
