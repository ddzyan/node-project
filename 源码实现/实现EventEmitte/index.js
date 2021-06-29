class EventEmitter {
  constructor() {
    this.events = Object.create({});
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events.has(eventName).push(listener);
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }

    const listenerList = this.events[eventName];
    for (const listener of listenerList) {
      listener(...args);
    }
  }

  // 添加单次监听器 listener 到名为 eventName 的事件。 当 eventName 事件下次触发时，监听器会先被移除，然后再调用。
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
