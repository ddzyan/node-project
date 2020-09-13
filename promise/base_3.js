const { EventEmitter } = require('events');

// TODO 待优化
const isFunction = function (cb) {
  return typeof cb === 'function';
};

const STATUS = {
  PENDING: 0,
  RESOLVE: 1,
  REJECT: 2,
};

class MyPromise extends EventEmitter {
  constructor(handler) {
    super();
    if (!isFunction(handler)) {
      throw new TypeError('handler must be function');
    }
    this._status = STATUS.PENDING;
    try {
      handler(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _resolve(data) {
    this._status = STATUS.RESOLVE;
    this.emit('success', data);
  }

  _reject(error) {
    this._status = STATUS.REJECT;
    this.emit('error', error);
  }

  then(cb) {
    if (!isFunction(cb)) {
      throw new TypeError('cb must be function');
    }
    this.on('success', cb);
    return this;
  }

  catch(cb) {
    if (!isFunction(cb)) {
      throw new TypeError('cb must be function');
    }
    this.on('error', cb);
    return this;
  }
}

const timeOut = function () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve('hello word');
      } catch (error) {
        reject(error);
      }
    }, 1 * 1000);
  });
};

timeOut().then(data => {
  console.log(data);
});
