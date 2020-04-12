const http = require('http');

const server = http.createServer((req, res) => {
  // throw new Error("意外退出");
  res.writeHead(200, { 'Content-Type': 'text/palin' });
  res.end(`hello word processId ${process.pid}`);
});

process.on('message', (m, tcp) => {
  if (m === 'server') {
    tcp.on('connection', (socket) => {
      server.emit('connection', socket);
    });
  }
});

/**
 * 处理未被程序捕获的异常
 */
process.on('uncaughtException', (err) => {
  // 记录日志
  console.log('uncaughtException :', err);
  // 通知父进程，创建新的进程处理请求
  process.send({ act: 'suicide' });
  // 关闭连接的服务，停止接收请求
  server.close(() => {
    // 关闭完成后，退出进程
    process.exit(1);
  });

  // 延迟计时器，防止关闭失败，导致进程卡死
  const exitTimer = setTimeout(() => {
    process.exit(1);
  }, 1 * 1000);
  exitTimer.unref();
});

console.log('child start processId = ', process.pid);
