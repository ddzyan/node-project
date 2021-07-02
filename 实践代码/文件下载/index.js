const axios = require('axios');
const fs = require('fs');
const path = require('path');

const url = 'https://npm.taobao.org/mirrors/node/v14.12.0/node-v14.12.0-x64.msi';

const main = async function () {
  const res = await downloadFile(url, './file', 'node-v14.12.0-x64.msi');

  console.log(res);
};

async function downloadFile(url, filepath, name) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  const mypath = path.resolve(filepath, name);
  const writer = fs.createWriteStream(mypath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

main();
