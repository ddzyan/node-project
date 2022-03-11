const http = require('http');

const MAX_EXIT_TIME = 3 * 1000;
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
  // 延迟计时器，防止关闭失败，导致进程卡死
  const killTimer = setTimeout(() => {
    process.exit(1);
  }, MAX_EXIT_TIME);
  // 通知父进程，创建新的进程处理请求
  process.send({ act: 'suicide' });
  // 关闭连接的服务，停止接收请求
  server.close(() => {
    // 进程关闭退出则关闭计时器
    killTimer.unref();
    // 关闭完成后，退出进程
    process.exit(1);
  });
});

console.log('child start processId = ', process.pid);
