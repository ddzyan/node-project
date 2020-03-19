// 采用数据流实现下载，只要建立连接，就可以获得数据，不需要等服务器缓存文件文件数据

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  const stream = fs.createReadStream(path.join(__dirname, {
    encoding: 'utf8'
  }, './data.txt'));
  stream.pipe(res);
}).listen(3000, () => {
  console.log('服务器启动成功');
})

