const ProcessPool = require('./lib/processPool');

const taskParams = [];
for (let i = 0; i < 100; i++) {
  taskParams[i] = [i];
}
// 创建进程池实例
const processPool = new ProcessPool({
  maxParallelProcess: 50, // 支持最大进程并行数
  timeToClose: 60 * 1000, // 单个任务被执行最大时长
  dependency: 'const path = require(\'path\')', // 任务脚本依赖
  workDir: __dirname, // 当前目录
  taskName: 'test', // 任务脚本名称
  script: async function task(workParam) {
    console.log(workParam);
  }, // 任务脚本内容
  taskParams, // 需要执行的任务参数列表，二维数组
});

// 利用进程池进行处理大规模任务
processPool.run();
