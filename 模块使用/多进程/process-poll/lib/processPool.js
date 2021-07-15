const fs = require('fs');

const { isCorrectType } = require('./util');
const ProcessItem = require('./newProcessItem');

class ProcessPool {
  constructor({
    maxParallelProcess = 50,
    timeToClose = 60 * 1000,
    taskParams = [],
    dependency = '',
    workDir = '',
    taskName = Date.now(),
    script = '',
  }) {
    try {
      // 参数校验
      isCorrectType('task', script, 'function');
      isCorrectType('maxParallelProcess', maxParallelProcess, 'number');
      isCorrectType('timeToClose', timeToClose, 'number');
      isCorrectType('dependency', dependency, 'string');
      isCorrectType('workDir', workDir, 'string');
    } catch (e) {
      throw new Error(`参数不合法${e}`);
    }

    this.timeToClose = timeToClose;
    this.processList = new Map(); // 使用Map存储进程对象
    this.currentProcessNum = 0; // 当前活动进程数
    this.dependency = dependency; // 任务脚本依赖
    this.workDir = workDir; // 主控函数工作目录
    this.taskName = taskName; // 任务脚本名称
    this.task = `${this.workDir}/${this.taskName}.js`; // 任务脚本路径
    this.taskParamsTodo = taskParams; // 待完成的任务参数数组，包含了n个小任务所需参数，所以是一个二维数组
    this.maxParallelProcess = maxParallelProcess; // 最大进程并行数
    this.script = script; // 任务脚本内容
    this.ready = false; // 任务脚本是否构建完成
    try {
      this.buildTaskScript(); // 根据模版创建任务脚本
    } catch (e) {
      throw new Error(`创建任务脚本失败${e}`);
    }
  }

  run() {
    if (this.ready) {
      const flag = this.hasWorkProcessRunning(); // 判断是否有工作进程正在执行或是否是第一次处理任务
      const taskTodoNum = this.taskParamsTodo.length;
      if (flag === 1 && taskTodoNum) {
        // 初始阶段，fork min{任务数，最大进程数} 的进程
        while (
          this.currentProcessNum < this.maxParallelProcess
          && this.currentProcessNum < taskTodoNum
        ) {
          this.addProcess();
        }
      } else if (flag === 2 && !taskTodoNum) {
        // 有忙碌的工作进程，且任务已下发完
      } else if (flag === 2 && taskTodoNum) {
        // 有忙碌的工作进程，但还有任务需下发
        const processList = this.processList.values();
        for (const p of processList) {
          if (p.state !== 1 || p.state !== 4) {
            this.reuseProcess(p.id);
          }
        }
      } else if (flag === -1 && taskTodoNum) {
        // 所有工作进程空闲，但还有任务需下发
        const processList = this.processList.values();
        for (const p of processList) {
          if (p.state !== 1 || p.state !== 4) {
            this.reuseProcess(p.id);
          }
        }
      } else if (flag < 0 && !taskTodoNum) {
        // 所有进程空闲，且任务已下发完
        this.closeProcessPool();
      }
    }
  }

  buildTaskScript() {
    const taskDir = this.task;
    const templateDir = `${__dirname}/task.js`;
    const dependency = `${this.dependency}\n`;
    const taskBody = this.script.toString();
    const templateReadStream = fs.createReadStream(templateDir);
    const taskWriteStream = fs.createWriteStream(taskDir);
    taskWriteStream.write(dependency);
    templateReadStream.pipe(taskWriteStream).write(taskBody);
    taskWriteStream.on('finish', () => {
      this.ready = true;
      this.run();
    });
  }

  hasWorkProcessRunning() {
    if (!this.processList) return -1;
    if (this.processList && !this.processList.size) return 1; // 进程池刚启动，尚无工作进程
    const processList = this.processList.values();
    for (const p of processList) {
      if (p.state === 1) return 2; // 有忙碌的进程
    }
    return -1;
  }

  addProcess() {
    if (this.currentProcessNum <= this.maxParallelProcess) {
      const workParam = this.taskParamsTodo.shift();
      const newProcess = new ProcessItem({ task: this.task, workParam });
      this.processList.set(newProcess.id, newProcess);
      this.currentProcessNum++;
      this.listenProcessState(newProcess, workParam);
    }
  }

  reuseProcess() {
    const workProcess = this.processList.get(id);
    if (this.taskParamsTodo.length && workProcess && workProcess.state !== 1) {
      const taskParam = this.taskParamsTodo.shift();
      workProcess.state = 1; // 设置为忙碌
      workProcess.process.send(taskParam);
    }
  }

  closeProcessPool() {
    this.removeAllProcess();
    this.ready = false;
    this.processList = null;
  }

  removeAllProcess() {
    const processItems = this.processList.values();
    for (const processItem of processItems) {
      processItem.terminate();
    }
  }

  removeProcess() {
    const workProcess = this.processList.get(id);
    if (workProcess) {
      workProcess.terminate();
      this.currentProcessNum--;
    }
  }

  listenProcessState() {
    workProcess.process.on('message', (message) => {
      if (message === 'finish') {
        workProcess.finishTask();
      } else if (message === 'failed') {
        this.taskParamsTodo.unshift(params);
        workProcess.unFinishTask();
      }
      this.run();
    });
  }
}

module.exports = ProcessPool;
