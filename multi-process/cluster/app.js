const http = require('http');

http.createServer(function (req, res) {
  res.end('hello word', process.pid)
}).listen(3000, function () {
  console.log('服务启动成功', process.pid);
});