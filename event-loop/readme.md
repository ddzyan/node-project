资料：

- https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/
- https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/

了解的内容：

- nodejs 如何实现异步非堵塞
- 什么是 事件循环
- 描述 事件循环 循环顺序
- 阶段任务处理流程
- 每个阶段的描述
- 理解 process.nextTick()
- 理解 setImmediate()

## 简介

记录 event-loop 测试 demo

### nodejs 事件循环

事件循环是 nodejs 处理非堵塞 I/O 的一种操作机制。

#### 什么要有 event-loop

nodejs 运行环境为单线程，特点为事件驱动，异步非堵塞 I/O。实现这个的原理为:nodejs 虽然为一个单线程任务，但是底层有 libuv 实现了一个事件循环线程。nodejs 将耗时的异步任务推送进 事件循环 队列中，然后就可以处理其他任务，避免了主线程堵塞引起效率低问题。在 事件循环 遍历中监测到任务状态完成，将通知主线继续执行任务。

#### event-loop 遍历顺序

1. time 定时器任务
2. pedding callback 执行延迟到下一轮的 I/O 回调
3. idle 系统内部调用
4. poll
   1. 监测新的 I/O
   2. 执行 I/O 回调，event-loop 将在这个阶段堵塞
5. checkout setImmediate()将在这个阶段运行
6. close callbacks 执行一些关闭事件的回调函数,例如:socket.on('close')

每个阶段都有一个回调函数队列，当事件循环执行到指定的阶段的时候，将执行这个阶段的所有代码，并将队列中的回调函数执行，直到队列用尽或者最大的回调函数执行。当队列用用尽或者最大的函数执行，事件循环将进入下一个阶段。

当 6 执行完毕后，将从 1 重新开始遍历。

##### 每个阶段描述

##### setImmdiate()

##### proce.nextTick()
