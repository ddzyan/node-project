const defaultMaxListeners = 10;

class EventEmitter {
  constructor() {
    this._count = defaultMaxListeners;
    this.events = Object.create({});
  }

  setMaxListeners(count) {
    this._count = count;
  }

  getMaxListeners() {
    return this._count || defaultMaxListeners;
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener);
  }

  // 当监听器函数被调用时，this 关键词会被指向监听器所绑定的 EventEmitter 实例
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }

    const listenerList = this.events[eventName];
    listenerList.forEach((listener) => listener.call(this, ...args));
  }

  // 添加单次监听器 listener 到名为 eventName 的事件。 当 eventName 事件下次触发时，监听器会先被移除，然后再调用。
  // 也可以使用 ES6 的箭头函数作为监听器。但 this 关键词不会指向 EventEmitter 实例：
  once(eventName, listener) {
    const warp = (...args) => {
      this.removeListener(eventName, listener);
      listener(...args);
    };

    this.on(eventName, warp);
    return this;
  }

  // 从名为 eventName 的事件的监听器数组中移除指定的 listener
  removeListener(eventName, removeListener) {
    if (!this.events[eventName]) {
      return;
    }

    const listenerList = this.events[eventName];
    listenerList.filter((listener) => removeListener !== listener);
  }

  removeAllListeners(eventName) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = undefined;
  }
}
