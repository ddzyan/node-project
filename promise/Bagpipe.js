/**
 *
 * 设置异步队列，将超出异步同步执行上线，放到队列中等待执行
 *
 * Bagpipe 继承与 Eventmit
 * 构造函数
 * 队列长度queue
 * 正在执行的任务active
 * 最大并发执行的任务数量 maxLimit
 * 任务超出 maxLimit 当 refuse=true,则添加到队列尾部等待执行，false则报错
 * ratio 队列长度最大可以大于几倍的最大执行长度
 *
 * push(fn,参数)添加异步任务
 * 判断最后一个参数是不是函数，不是则添加一个空函数
 * 判断队列长度是不是小于1，是则直接执行方法
 * 如果 queue 长度大于最大长度并且 refuse 等于 false，满足则回调函数返回错误
 * 不满足则将函数添加到队列中，参数为 fn 和 args
 * 发送添加成功事件
 *
 * next() 执行任务队列任务
 * 如果正在执行的任务大于最大任务数量或者当前队列长度为0,满足则跳出不执行
 * 不满足则取出队列第一个值的方法和参数
 * 取出参数中的回调函数
 * 重新定义回调函数，在方法执行成功时候，减少active，并且执行next
 */
const fs = require("fs");
const { EventEmitter } = require("events");

class Bagpipe extends EventEmitter {
  constructor(limit, option) {
    super();
    this.option = {
      refuse: false, // 拒绝执行并发任务，测试使用
      ratio: 1 // 队列长度最大可以大于几倍的最大执行长度
    };
    if (typeof option === "object") {
      for (const key in option) {
        if (option.hasOwnProperty(key)) {
          this.option[key] = object[key];
        }
      }
    }
    this.maxLimit = limit;
    this.queue = [];
    this.active = 0;

    this.queueLength = Math.random(limit * (this.option.ratio || 1));
  }

  push(method, ...args) {
    // 如果没有回调函数，则添加
    if (typeof args[args.length - 1] !== "function") {
      args.push(function() {});
    }

    const callback = args[args.length - 1];

    if (this.maxLimit === 1) {
      method(...args);
      return;
    }

    // 当数组超出队列最大长度或者拒绝执行并发任务
    if (this.queue.length < this.queueLength || !this.option.refuse) {
      this.queue.push({
        method,
        args
      });
      this.emit("push", this.queue.length);
    } else {
      callback(new Error("超出队列长度"));
    }
    this.next();
    return this;
  }

  next() {
    if (this.active > this.maxLimit || !this.queue.length) {
      return;
    }

    this.active++;
    const { method, args } = this.queue.shift();
    const callback = args[args.length - 1];
    args[args.length - 1] = (error, ...rest) => {
      callback(error, ...rest);
      this._next();
    };
    method(...args);
  }

  _next() {
    this.active--;
    this.next();
  }
}

const bagpipe = new Bagpipe(2);

bagpipe.on("push", data => {
  console.log("queue length :", data);
});

bagpipe.push(fs.readFile, "./text/file1.txt", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data.toString());
  }
});
