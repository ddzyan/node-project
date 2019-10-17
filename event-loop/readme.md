资料：

- https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/
- https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/
- https://segmentfault.com/a/1190000019117230
- https://cnodejs.org/topic/5da554bcece3813ad9ba1d81#5da6ceecece3813ad9ba220f

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

事件循环是 nodejs 处理非堵塞 I/O 的解决方案,它基于 events and callbacks 机制。

#### 什么要有 event-loop

nodejs 运行环境为单线程，特点为事件驱动，异步非堵塞 I/O。实现这个的原理为:nodejs 虽然为一个单线程任务，但是底层有 libuv 实现了一个事件循环线程。nodejs 将耗时的异步任务推送进 事件循环 队列中，然后就可以处理其他任务，避免了主线程堵塞引起效率低问题。在 事件循环 遍历中监测到任务状态完成，将通知主线继续执行任务。

- 主线程在执行同步代码时，遇到异步 api，则将任务分配到指定阶段的模块去执行，并且对一个全局计数器 ref++。 当任务执行完毕后，会将任务的回调函数添加到对应阶段的回调函数队列中。
- event-loop 会按照阶段顺序进行遍历和执行回调函数队列，每一个回调函数被执行完毕，会对全局计数器 ref ---,当队列中的回调函数用尽或者最大的回调函数执行，event-loop 将进入下一个阶段。
- 当 ref 为 0 时，则结束 js 运行，当 res 大于 0 ，则继续 loop.

最大的回调函数：系统设置的回调函数队列上线，防止回调函数过多，影响执行效率。

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

执行顺序：process.nextTick() > event-loop > setImmediate()，当 6 执行完毕后，将从 1 重新开始遍历。

#### 每个阶段描述

##### time

定时器的执行时间可能不准确，因为当事件循环进入 poll 阶段需要执行所有代码，并且执行回调队列内函数。如果这个阶段造成延迟，会导致下次遍历 time 阶段落后，造成定时器时间延迟

##### poll

在 node.js 里，除了上面几个特定阶段的 callback 之外，任何异步方法完成时，都会将其 callback 加到 poll queue 里。

当 event loop 到 poll 阶段时，且不存在 timer，将会发生下面的情况

1. 如果 poll queue 不为空，event loop 将同步的执行 queue 里的 callback,直至 queue 为空，或执行的 callback 到达系统上限;
2. 如果 poll queue 为空，将会发生下面情况：
   1. 如果代码已经被 setImmediate()设定了 callback 或者有满足 close callbacks 阶段的 callback, event loop 将结束 poll 阶段进入 check 阶段，并执行 check 阶段的 queue (check 阶段的 queue 是 setImmediate 设定的)
   2. 如果代码没有设定 setImmediate(callback)或者没有满足 close callbacks 阶段的 callback，event loop 将阻塞在该阶段等待 callbacks 加入 poll queue;

当 event loop 到 poll 阶段时，如果存在 timer 并且 timer 未到超时时间，将会发生下面情况：

- 则会把最近的一个 timer 剩余超时时间作为参数传入 io_poll()中，这样 event loop 阻塞在 poll 阶段等待时，如果没有任何 I/O 事件触发，也会由 timerout 触发跳出等待的操作，结束本阶段，然后在 close callbacks 阶段结束之后会在进行一次 timer 超时判断

##### setImmdiate()

##### proce.nextTick()

proce.nextTick() 函数的执行时间 event-loop 之前
