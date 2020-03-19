// 需要服务读取完全部数据后，才可以进行响应客户端传输数据

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'utf8', './data.txt'), (err, data) => {
    if (err) {
      throw err;
    } else {
      res.end(data);
    }
  })
}).listen(3001)