const { parentPort } = require('worker_threads');

// import { commonContext } from './common-variable'
const { isFunction, isJSFile } = require('./utils');

// 监听主线程提交过来的任务
parentPort.on('message', async (work) => {
  try {
    const { filename, options } = work;
    let aFunction;
    if (isJSFile(filename)) {
      aFunction = require(filename);
    }
    if (!isFunction(aFunction)) {
      throw new Error('work type error: js file or string');
    }

    /* const event = {
      req: reqRecord.forkReq,
    }; */

    work.data = await aFunction(options);
    parentPort.postMessage({ event: 'done', work });
  } catch (error) {
    // 错误通知主进程
    work.error = error.toString();
    parentPort.postMessage({ event: 'error', work });
  }
});

// 监听线程未捕获的异常
process.on('uncaughtException', (...rest) => {
  console.error('uncaughtException', ...rest);
});

// 监听线程未捕获的 promise 异常
process.on('unhandledRejection', (...rest) => {
  console.error('unhandledRejection', ...rest);
});
