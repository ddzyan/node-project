## 简介

promise 是 es6 实现异步的新语法。它将每个异步都封装成一个 promise 对象，对象内部管理着异步的状态，当状态为成功则通过 resove 函数回调，当状态失败则通过 reject 函数回调。

这个 demo 主要通过 promise 原理实现一个 promise 对象。

1. demo1:使用 发布/订阅模式 实现最基础的 promise 状态管理
2. demo2:在 demo1 的基础上，实现异步并发的 all 方法
3. demo3:在 demo1 的基础上，实现 promise 对象的同步链式处理，避免出现回调地狱
   1. 使用 some 封装类似与 fs.readFile(filename,(error,data))的异步任务
