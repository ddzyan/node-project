## 简介

promise 是 es6 实现异步的新语法。它将每个异步都封装成一个 promise 对象，对象内部管理着异步的状态，当状态为成功则通过 resove 函数回调，当状态失败则通过 reject 函数回调。

这个 demo 主要通过 promise 原理实现一个 promise 对象。