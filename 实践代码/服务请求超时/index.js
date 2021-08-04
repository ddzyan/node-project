const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url !== '/favicon.ico') {
    // 超时监听
    req.setTimeout(1000);
    req.on('timeout', () => {
      console.log('响应超时.');
      res.end('13123');
    });

    // 超时直接回调
    // res.setTimeout(1000, () => {
    //   console.log('res 响应超时.');
    // });
    setTimeout(() => {
      if (!res.writableFinished) {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><head><meta charset=\'utf-8\' /></head>');
        res.write('你好');
        res.end();
      }
    }, 2000);
  }
});
server.listen(1337, 'localhost', () => {
  console.log(`开始监听${server.address().port}......`);
});
