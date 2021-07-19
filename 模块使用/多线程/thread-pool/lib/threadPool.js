const { Worker, threadId } = require('worker_threads');
const { EventEmitter } = require('events');
const path = require('path');

const config = require('./config');
const Work = require('./work');
const { THREAD_STATE, WORK_STATE } = require('./constants');

const workerPath = path.resolve(__dirname, 'worker.js');

// 提供给用户侧的接口
class UserWork extends EventEmitter {
  constructor(workId) {
    super();
    this.workId = workId;
    this.timer = null;
    this.state = WORK_STATE.PENDDING;
  }

  setTimeout(timeout) {
    this.timer = setTimeout(() => {
      this.timer && this.cancel() && this.emit('timeout');
    }, ~~timeout);
  }

  clearTimeout() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  cancel() {
    if (this.state === WORK_STATE.END || this.state === WORK_STATE.CANCELED) {
      return false;
    }
    this.terminate();
    return true;
  }

  // 修改任务状态
  setState(state) {
    this.state = state;
  }
}

// 线程对象
class Thread {
  constructor(worker) {
    this.worker = worker;
    this.threadId = worker.threadId;
    this.state = THREAD_STATE.IDLE;
    this.lastWorkTime = Date.now();
  }

  setState(state) {
    this.state = state;
  }

  setLastWorkTime(time) {
    this.lastWorkTime = time;
  }
}

// 线程池对象
class ThreadPool {
  constructor() {
    // 核心线程数
    this.coreThreads = config.CORE_THREADS;
    // this.preCreate = options.preCreate === true;
    this.maxIdleTime = config.MAX_IDLE_TIME;
    // this.preCreate && this.preCreateThreads();

    this.workId = 0;
    this.totalWork = 0;
    this.maxWork = config.MAX_WORK;
    this.pollIdle();
    this.timeout = config.TIMEOUT;

    this.queue = [];
    this.workPool = {};
    this.workerQueue = [];
  }

  // 支持空闲退出
  pollIdle() {
    const timer = setTimeout(() => {
      for (let i = 0; i < this.workerQueue.length; i++) {
        const thread = this.workerQueue[i];
        if (
          thread.state === THREAD_STATE.IDLE
          && Date.now() - thread.lastWorkTime > this.maxIdleTime
        ) {
          thread.worker.terminate();
        }
      }
      this.pollIdle();
    }, 1000);
    timer.unref();
  }

  newThread() {
    const worker = new Worker(workerPath);
    const thread = new Thread(worker);
    this.workerQueue.push(thread);

    // 线程退出
    worker.on('exit', () => {
      // 找到该线程对应的数据结构，然后删除该线程的数据结构
      const position = this.workerQueue.findIndex(
        (thread) => thread.threadId === threadId,
      );
      const exitedThread = this.workerQueue.splice(position, 1);
      // 退出时状态是BUSY说明还在处理任务（非正常退出）
      this.totalWork -= exitedThread.state === THREAD_STATE.BUSY ? 1 : 0;
    });

    // 线程通讯
    worker.on('message', (result) => {
      const { event, work } = result;
      const { data, error, workId } = work;

      const userWork = this.workPool[workId];
      if (!userWork) {
        return;
      }

      this.endWork(userWork);

      thread.setLastWorkTime(Date.now());

      if (this.queue.length) {
        this.submitWorkToThread(thread, this.queue.shift());
      } else {
        thread.setState(THREAD_STATE.IDLE);
      }

      switch (event) {
        case 'done':
          userWork.emit('done', data);
          break;
        case 'error':
          if (EventEmitter.listenerCount(userWork, 'error')) {
            userWork.emit('error', error);
          }
          break;
        default:
          break;
      }
    });

    // 线程错误
    worker.on('error', (...rest) => {
      console.error(...rest);
    });

    return thread;
  }

  selectThead() {
    // 找出空闲的线程，把任务交给他
    for (let i = 0; i < this.workerQueue.length; i++) {
      if (this.workerQueue[i].state === THREAD_STATE.IDLE) {
        return this.workerQueue[i];
      }
    }
    // 没有空闲的则随机选择一个
    return this.workerQueue[~~(Math.random() * this.workerQueue.length)];
  }

  submit(filename, options = {}) {
    return new Promise(async (resolve, reject) => {
      let thread;
      if (this.workerQueue.length) {
        thread = this.selectThead();
        if (thread.state === THREAD_STATE.BUSY) {
          if (this.workerQueue.length < this.coreThreads) {
            thread = this.newThread();
          } else if (this.totalWork + 1 > this.maxWork) {
            // 任务总数已经超过阈值，一定策略优化
          } else {
            // 任务总数没有超过阈值，则将任务提交给选中的线程
          }
        }
      } else {
        // 线程池为空则创建
        thread = this.newThread();
      }

      const workId = this.generateWorkId();
      const userWork = new UserWork(workId);
      this.timeout && userWork.setTimeout(this.timeout);
      // work 对象 传入 线程执行
      const work = new Work({ workId, filename, options });

      this.addWork(userWork);

      if (thread.state === THREAD_STATE.BUSY) {
        this.queue.push(work);
        userWork.terminate = () => {
          this.cancelWork(userWork);
          this.queue = this.queue.filter((node) => node.workId !== work.workId);
        };
      } else {
        this.submitWorkToThread(thread, work);
      }
      resolve(userWork);
    });
  }

  submitWorkToThread(thread, work) {
    const userWork = this.workPool[work.workId];
    userWork.setState(WORK_STATE.RUNNING);
    // 否则交给线程处理，并修改状态和记录该线程当前处理的任务id
    thread.setState(THREAD_STATE.BUSY);
    thread.worker.postMessage(work);
    userWork.terminate = () => {
      this.cancelWork(userWork);
      thread.setState(THREAD_STATE.DEAD);
      thread.worker.terminate();
    };
  }

  // 取消任务
  cancelWork(userWork) {
    delete this.workPool[userWork.workId];
    this.totalWork--;
    userWork.setState(WORK_STATE.CANCELED);
    userWork.emit('cancel');
  }

  // 生成 work id
  generateWorkId() {
    return ++this.workId % Number.MAX_SAFE_INTEGER;
  }

  // 添加任务
  addWork(userWork) {
    userWork.setState(WORK_STATE.PENDDING);
    this.workPool[userWork.workId] = userWork;
    this.totalWork++;
  }

  endWork(userWork) {
    delete this.workPool[userWork.workId];
    this.totalWork--;
    userWork.setState(WORK_STATE.END);
    userWork.clearTimeout();
  }
}

const threadPool = new ThreadPool();

module.exports = threadPool;
