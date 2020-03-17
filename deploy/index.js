const { spawn } = require('child_process');
const child = spawn('node', ['./server'], {
  detached: true,// 后台主席
  stdio: 'ignore'// 不处理控制台的输出
});
child.unref();//父进程可以独立于子进程退出
