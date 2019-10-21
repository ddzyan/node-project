const { EventEmitter } = require('events');

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

/**
 * 向外部传递数据
 */
class PromiseA extends EventEmitter {
  then(fulfilledHandler) {
    if (typeof fulfilledHandler === 'function') {
      this.on('success', fulfilledHandler);
    }

    return this;
  }

  catch(errorHandler) {
    if (typeof errorHandler === 'function') {
      this.on('error', errorHandler);
    }

    return this;
  }
}

/**
 * 内部状态管理
 */
class Deferred {
  constructor() {
    this.state = PENDING;
    this.promise = new PromiseA();
  }
  resolve(obj) {
    this.state = FULFILLED;
    this.promise.emit('success', obj);
  }

  reject(error) {
    this.state = REJECTED;
    this.promise.emit('error', error);
  }

  progress(data) {
    this.promise.emit('progress', data);
  }
}

const timeout = function() {
  const deferred = new Deferred();
  setTimeout(function() {
    try {
      deferred.resolve('hello word');
    } catch (error) {
      deferred.reject(error);
    }
  }, 1000);
  return deferred.promise;
};

timeout()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
