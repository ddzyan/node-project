function cb(msg) {
  return function() {
    console.log(msg);
  };
}

setTimeout(cb("setTimeout"), 1000);
setImmediate(cb("setImmediate"));
process.nextTick(cb("process.nextTick"));
cb("Main process")();

/**
 * Main process (主线程代码)
 * process.nextTick
 * setImmediate
 * setTimeout
 *
 *执行顺序为主线程代码 > process.nextTick > setImmediate > setTimeout(开启event-loop)
 */
