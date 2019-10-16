/**
 * 参数为传入的所有中间件组成的数组
 * 返回一个 promise 对象
 */

const http = require("http");

const compose = require("./koa-compose");

class Koa {
  constructor() {
    this.middleware = [];
  }

  /**
   * 注册中间件
   * 返回实例，用于链式持续添加
   * @param {Function} fn
   * @returns Koa
   */
  use(fn) {
    if (typeof fn !== "function") throw new Error("中间件必须是函数");
    this.middleware.push(fn);
    return this;
  }

  callback() {
    const fn = compose(this.middleware);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    const result = fnMiddleware(ctx);
    return result.then(handleResponse).catch(onerror);
  }

  createContext(req, res) {
    let context = Object.create(null);
    context.req = req;
    context.res = res;
    return context;
  }

  /**
   * 创建服务，执行中间件
   * 启动监听
   */
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  onerror(err) {
    console.error(err);
  }
}

function respond(ctx) {
  const res = ctx.res;
  let body = ctx.body;
  res.end(body);
}

module.exports = Koa;
