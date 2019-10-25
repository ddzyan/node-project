/**
 * 在 demo2 的基础上实现 promise的链式调用
 * 解决多个异步相互依赖，造成代码出现回调地狱的问题
 */

const { EventEmitter } = require("events");
const fs = require("fs");

const PADDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

// 负责向外部传递状态
class PromiseA extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.isPromise = true;
  }
  then(successHandle) {
    const handler = {};
    if (typeof successHandle !== "function") throw new Error("参数必须是函数");
    handler.fulfilled = successHandle;
    this.queue.push(handler);
    // 只有返回对象本身，才可以继续捕捉catch
    return this;
  }

  catch(errorHandle) {
    const handler = {};
    if (typeof errorHandle !== "function") throw new Error("参数必须是函数");
    handler.fulfilled = errorHandle;
    this.queue.push(handler);
    return this;
  }
}

// 内部的状态管理
class Deferred {
  constructor() {
    this.promise = new PromiseA();
    this.status = PADDING;
  }

  // 完成状态
  resolve(obj) {
    this.status = FULFILLED;
    const promise = this.promise;
    let handler;
    //移出首位成功回调
    while ((handler = promise.queue.shift())) {
      // 判断是否存在，并且是否绑定回调函数
      if (handler && handler.fulfilled) {
        // 执行回调函数
        const ret = handler.fulfilled(obj);
        // 判断是否有返回值，返回值是否为一个 promise 对象
        if (ret && ret.isPromise) {
          // 将老的 promise 队列,添加到新的 promise 对象 ret 中
          // 修改老对象的 promise 为 ret
          ret.queue = promise.queue;
          this.promise = ret;
          return;
        }
      }
    }
  }

  //失败状态
  reject(err) {
    this.status = REJECTED;
    const promise = this.promise;
    let handler;
    while ((handler = promise.queue.shift())) {
      if (handler && handler.error) {
        const ret = handler.error(err);
        if (ret && ret.isPromise) {
          ret.queue = promise.queue;
          this.promise = ret;
          return;
        }
      }
    }
  }

  callback() {
    const that = this;
    return function(err, data) {
      if (err) {
        return that.reject(err);
      }
      that.resolve(data);
    };
  }

  // 并发执行
  all(promises) {
    if (!Array.isArray(promises)) throw new Error("参数必须是数组");
    for (const promise of promises) {
      if (!(promise instanceof PromiseA)) {
        throw new Error("数组成员必须是Promise对象");
      }
    }
    const result = [];
    let count = promises.length;
    promises.forEach((promise, i) => {
      promise
        .then(data => {
          result[i] = data;
          count--;
          if (count === 0) {
            this.resolve(result);
          }
        })
        .catch(error => {
          this.reject(error);
        });
    });
    return this.promise;
  }
}

/* const timeout = function(i) {
  const deferred = new Deferred();
  setTimeout(function() {
    deferred.resolve(`timeout${i} is ok`);
  }, 1000);
  return deferred.promise;
}; */

/**
 * 包装 fs.readFile(filename,(error,data))类型函数
 * @param {function} fn
 */
const some = function(fn) {
  return function(...args) {
    const deferred = new Deferred();
    args.push(deferred.callback()); //参数整合，将回调函数放在末尾，前面则为传入的文件名称
    fn.apply(null, args); //apply参数为数组方式传入，call除了第一个参数以外，其他按照顺序传入，bind 不传入参数
    return deferred.promise;
  };
};

const readFile = some(fs.readFile);

/**
 * 链式调用
 * 1. 将绑定的所有 then 方法，按照顺序添加到函数返回的 promise1.queue 中
 * 2. 循环判断 promise1.queue 第一个值是否为绑定的成功回调函数
 * 3. 将执行结果传递到回调函数中，获得回调函数返回值
 * 4. 判断返回值是否为一个 promise2 对象
 * 5. 是则将绑定在第一个 promise1 对象中的 queue 赋予 返回值的 promise2.queue
 * 6. 当前的promise2 赋值给 promise1,这样才可以触发绑定的then事件
 */
readFile("./text/file1.txt")
  .then(data => {
    console.log("链式调用1 :", data.toString());
    return readFile("./text/file2.txt");
  })
  .then(data => {
    console.log("链式调用2 :", data.toString());
  });
