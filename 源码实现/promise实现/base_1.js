/* const a = new Promise((resolve,reject)={

});

a.then((result) => {
  
}).catch((err) => {
  
}); */

/**
 * 实现基础版本 Promise
 *  PromiseA 负责接收结构和方法调用
 *  Deferred 负责状态修改和结果通知
 */

const { EventEmitter } = require('events');

const STATUS = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
};

class PromiseA extends EventEmitter {
  then(cb) {
    this.on('success', cb);
    return this;
  }

  catch(cb) {
    this.on('error', cb);
    return this;
  }
}

class Deferred {
  constructor() {
    this.status = STATUS.PENDING;
    this.promise = new PromiseA();
  }

  resolve(data) {
    this.promise.emit('success', data);
    this.status = STATUS.FULFILLED;
  }

  reject(error) {
    this.promise.emit('error', error);
    this.status = STATUS.REJECTED;
  }
}

const timeOut = function () {
  const deferred = new Deferred();
  setTimeout(() => {
    deferred.resolve('hello word');
  }, 1 * 1000);
  return deferred.promise;
};

timeOut().then(data => {
  console.log(data);
});
