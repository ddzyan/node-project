/**
 * demo目的：定时器执行的时间，可能大于预设时间
 * evet-loop 在 time 阶段将等待 95 ms ，直到达到最快的计时器阈值
 * 95 ms 后进入 poll 阶段，执行 fs 文件读取和回调函数内代码
 * 全部执行完毕后，再进入 time 阶段，执行回调函数
 *
 * 控制台输出：
 * someAsyncOperation time 89 ms
 * fib time 1321 ms
 * setTimeout 100 time 1329 ms
 */

const fs = require("fs");

const someAsyncOperation = cb => {
  fs.readFile("./abc.txt", cb);
};

function fib(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fib(num - 2) + fib(num - 1);
}

const startTime = Date.now();

setTimeout(() => {
  console.log("setTimeout 100 time %s ms", Date.now() - startTime);
}, 100);

/* setTimeout(() => {
  console.log("setTimeout 10 time %s ms", Date.now() - startTime);
}, 10); */

someAsyncOperation(() => {
  console.log("someAsyncOperation time %s ms", Date.now() - startTime);
  fib(30);
  console.log("fib time %s ms", Date.now() - startTime);
});

/* setImmediate(() => {
  console.log("setImmediate %s", Date.now() - startTime);
}); */
