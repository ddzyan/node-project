const ChildProcess = require('child_process');

/**
 * state
 * 1 进程正在使用
 * 2 进行空闲
 * 3 执行失败
 * 4 进程关闭
 */

class ProcessItem {
  constructor({ task = './task.js', workParam = [] }) {
    if (!Array.isArray(workParam)) {
      throw new Error('workParam must be a array');
    }
    if (typeof task !== 'string') {
      throw new Error('workParam must be a string');
    }
    this.process = this.createProcess(task, workParam);
    this.state = 1;
    this.id = this.process.pid;
  }

  createProcess(task, workParam) {
    const childProcess = ChildProcess.fork(task, workParam);
    if (childProcess) {
      return childProcess;
    }
    throw new Error('create process failed');
  }

  finishTask() {
    if (this.state === 1) {
      this.state = 2;
    }
  }

  unFinishTask() {
    this.state = 3;
  }

  terminate() {
    try {
      this.process.kill();
      this.state = 4;
    } catch (e) {
      throw new Error(`关闭进程${this.id} 失败`);
    }
  }
}

module.exports = ProcessItem;
