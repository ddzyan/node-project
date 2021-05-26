/**
 * 发布/订阅 设计模式
 * 事件消息发送和监听
 */

class EventEmitter {
  constructor() {
    this.handler = Object.create(null);
  }

  //消息监听
  on(type, callback) {
    if (!this.handler[type]) this.handler[type] = [];

    this.handler[type].push(callback);
  }

  // 消息发送
  emit(type, ...args) {
    if (this.handler[type]) {
      for (const cb of this.handler[type]) {
        cb(...args);
      }
    }
  }

  // 单次监听事件
  once(type, callback) {
    if (!this.handler[type]) this.handler[type] = [];
    let isOk = false;

    const once = (...args) => {
      if (!isOk) {
        isOk = true;
        delete this.handler[type];

        callback(...args);
      }
    };
    this.handler[type].push(once);
  }

  // 移除
  remove(type) {
    if (this.handler[type]) delete this.handler[type];
  }
}

const player = new EventEmitter();

player.on("start", data => {
  console.log("on start", data);
});

player.remove("start");

player.once("ok", data => {
  console.log("ok start", data);
});
player.emit("start", "周杰伦");

player.emit("ok", "周杰伦");
