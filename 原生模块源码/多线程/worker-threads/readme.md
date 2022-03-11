## 简介

工作线程对于执行 CPU 密集型的 JavaScript 操作非常有用。 它们对于 I/O 密集型的工作帮助不大。 Node.js 内置的异步 I/O 操作比工作线程效率更高。

worker_threads 可以共享内存。 它们通过传输 ArrayBuffer 实例或者共享 SharedArrayBuffer 实例来做到。

## 使用

```sh
time node ./index.js

node ./index.js  8.60s user 0.08s system 177% cpu 4.896 total
```

user 时间是指进程花费在用户模式中的 CPU 时间，这是唯一真正用于执行进程所花费的时间，其他进程和花费阻塞状态中的时间没有计算在内。

sys 时间是指花费在内核模式中的 CPU 时间，代表在内核中执系统调用所花费的时间，这也是真正由进程使用的 CPU 时间。

cpu cpu 利用率

total 总共消耗的时间
