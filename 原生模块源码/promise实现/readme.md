参考资料：

- https://github.com/JacksonTian/bagpipe/blob/master/lib/bagpipe.js

## 简介

promise 是 es6 实现异步的新语法。它将每个异步都封装成一个 promise 对象，对象内部管理着异步的状态，当状态为成功则通过 resolve 函数回调，当状态失败则通过 reject 函数回调。

这个 demo 主要通过 promise 原理实现一个 promise 对象。

1. base1:使用两个类（PromiseA 和 Deferred 管理和返回异步操作） 实现最基础的 promise 状态管理
2. base2:在原基础上，将 PromiseA 和 Deferred 函数合并为 MyPromise，使使用方法和 Promise 一致
3. demo2:在 demo1 的基础上，实现异步并发的 all 方法
4. demo3:在 demo1 的基础上，实现 promise 对象的同步链式处理，避免出现回调地狱
   1. 使用 some 封装类似与 fs.readFile(filename,(error,data))的异步任务
5. Bagpipe.js 设置异步任务队列，当并发数超出设置长度，则将后续的任务添加到队列中，等待其他异步任务完成后，再继续执行
