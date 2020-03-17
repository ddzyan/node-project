const os = require('os');
const cluster = require('cluster');

const server = require('./server');

const works = new Map();
if (cluster.isMaster) {
  /**
   *  进程复制
   *  进程意外退出，马上重启一个新的进程
   *  重启时，要判断重启次数，防止无限重启
   */
  const limit = os.cpus().length;
  for (let i = 0; i < limit; i++) {
    const worker = cluster.fork();
    works.set(worker.process.pid, worker);
  }

  cluster.on('exit', function (worker, code, signal) {
    works.delete('process exit', worker.process.pid);
  });
} else {
  // 不是主线程则创建服务,特点为共享一个TCP端口，并且使用负载均衡
  server();
}