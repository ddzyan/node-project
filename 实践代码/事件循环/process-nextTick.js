const EventEmitter = require("events");
const util = require("util");

function MyEmitter() {
  EventEmitter.call(this);
  /* process.nextTick(() => {
    this.emit("event");
  }); */
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on("event", () => {
  console.log("an event occurred!");
});
