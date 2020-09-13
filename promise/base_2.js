/**
 * 在原基础上，将 PromiseA 和 Deferred 函数合并为 MyPromise，使使用方法和 Promise 一致
 */

const { EventEmitter } = require('events');

const STATUS = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
};

class Deferred extends EventEmitter {
  constructor(handler) {
    super();
    if (typeof handler !== 'function') {
      return new TypeError('handler must be function');
    }
    this._status = STATUS.PENDING;
    try {
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _resolve(data) {
    this.emit('success', data);
    this._status = STATUS.FULFILLED;
  }

  _reject(error) {
    this.emit('error', error);
    this._status = STATUS.REJECTED;
  }

  then(cb) {
    if (typeof cb !== 'function') {
      return new TypeError('cb must be function');
    }
    this.on('success', cb);
  }

  catch(cb) {
    if (typeof cb !== 'function') {
      return new TypeError('cb must be function');
    }
    this.on('error', cb);
  }
}

const timeOut = function () {
  const deferred = new Deferred((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve('hello word');
      } catch (error) {
        reject(error);
      }
    }, 1 * 1000);
  });

  return deferred;
};

timeOut().then(data => {
  console.log(data);
});
