/**
 * 参数为传入的所有中间件组成的数组
 * 返回一个 promise 对象
 */

/*
  ! 你可以试试的嘛？
  ? 你不知道对错
  Todo this function
  Todo this function
  //试试
  * 你又不会死
  */

const http = require("http");

function compose(middleware) {
  if (!Array.isArray(middleware)) throw new Error("传入的参数必须为数组");
  for (const fn of middleware) {
    if (typeof fn !== "function") throw new Error("中间件必须为函数");
  }

  return function(context, next) {
    // 实现递归回调
    let index = -1;
    dispatch(0);
    function dispatch(i) {
      if (i <= index) throw new Error("遍历的范围不能小于0");
      let fn = middleware[i];

      if (i === middleware.length) fn = next;

      try {
        return Promise.resolve(
          fn(context, function next() {
            // 执行下一个回调函数
            return dispatch(null, i + 1);
          })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

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
