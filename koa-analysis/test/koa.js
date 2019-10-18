const http = require("http");

const compose = require("./koa-compose");

module.exports = class Koa {
  constructor() {
    this.md = [];
  }

  use(fn) {
    if (typeof fn !== "function") throw new Error("中间件必须是函数");
    this.md.push(fn);
    return this;
  }

  callback() {
    const fn = compose(this.md);
    const requestHandle = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.requestHandle(ctx, fn);
    };

    return requestHandle;
  }

  errorHandle(error) {
    console.error(error);
  }

  requestHandle(ctx, fn) {
    const errorHandle = error => this.errorHandle(error);
    const resHandle = () => respond(ctx);
    fn(ctx)
      .then(resHandle)
      .catch(errorHandle);
  }

  createContext(req, res) {
    let ctx = Object.create(null);
    ctx.req = req;
    ctx.res = res;
    return ctx;
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
};

function respond(ctx) {
  const { res, body } = ctx;
  res.end(body);
}
