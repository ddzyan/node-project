/**
 * process.nextTick(),time(),setImmediate() 函数执行顺序
 * 结论执行顺序为主线程代码 > process.nextTick > setImmediate > setTimeout(开启event-loop)
 */

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
 * 控制台输出结果
 * Main process
 * process.nextTick
 * setImmediate
 * setTimeout
 */
