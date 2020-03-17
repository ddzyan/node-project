const http = require('http');
const fs = require('fs');
const cluster = require('cluster');

const MAXTIMEOUT = 10 * 1000;
const unhandledRejections = new Map();

const server = http.createServer(function (req, res) {
  res.end('hello word');
}).listen(3000, function () {
  console.log('服务启动成功');
})

// 未try catch 捕获的异常
process.on('uncaughtException', (err, origin) => {
  // 首先记录异常信息
  fs.writeSync(
    process.stderr.fd,
    `捕获的异常: ${err}\n` +
    `异常的来源: ${origin}`
  );
  try {
    /**
     *  首先关闭服务，停止接收新的请求
     *  如果服务是多进程部署，需要通知主线程
     *  以上处理完毕后，则关闭退出进程
     */

    const killTime = setInterval(() => {
      process.exit(1);
    }, 1000);

    killTime.unref();
    server.close();
    if (cluster.worker) {
      cluster.worker.disconnect();
    }
  } catch (error) {
    console.log(error);
  }
})

// 未被捕获的promise异常
process.on('unhandledRejection', (reason, promise) => {
  // 首先记录异常信息
  unhandledRejections.set(promise, reason);

  // 如果在最大时间内异常未被处理，则进行日志记录，并且移除异常
  setTimeout(() => {
    console.log(reason);
    unhandledRejections.delete(promise);
  }, MAXTIMEOUT);

})

// promise异常被处理
process.on('rejectionHandled', (promise) => {
  unhandledRejections.has(promise) && unhandledRejections.delete(promise);
})  