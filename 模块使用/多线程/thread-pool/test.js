const http = require('http');
const path = require('path');

const threadPool = require('./lib/threadPool');

http
  .createServer(async (req, res) => {
    const userWork = await threadPool.submit(
      path.resolve(__dirname, 'demo.js'),
    );
    userWork.on('done', (data) => {
      res.end(data);
    });
    userWork.on('error', (err) => {
      console.error(err);
      res.end('执行失败');
    });
  })
  .listen(7001);
