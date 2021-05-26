class PubSub {
  constructor() {
    this.cbsMap = new Map();
  }

  on(type, cb) {
    if (!this.cbsMap.has(type)) {
      this.cbsMap.set(type, []);
    }
    const cbs = this.cbsMap.get(type);
    cbs.push(cb);
    this.cbsMap.set(type, cbs);
  }

  emit(type, ...args) {
    if (this.cbsMap.has(type)) {
      const cbs = this.cbsMap.get(type);
      for (const cb of cbs) {
        cb(...args);
      }
    }
  }
}

const pubSub = new PubSub();
pubSub.on('timeout', () => {
  console.log('异步回调');
})

setTimeout(() => {
  pubSub.emit('timeout');
}, 1000);