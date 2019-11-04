/**
 * koa 对象
 * todo 启动服务，监听端口
 * todo 添加中间件
 * todo 中间件处理，添加到 createServer()中
 * todo 创建 ctx 对象
 * todo 统一的错误和正确信息返回
 */

const http = require("http");

const compose = require("./koa-compose");
const request = require("./request");

class Koa {
  /**
   * md 中间件数组
   */
  constructor() {
    this.middleware = [];
    this.request = Object.create(request);
  }

  /**
   * 添加中间件
   * @param {function} fn
   * @return {Object} Koa
   */
  use(fn) {
    if (typeof fn !== "function") throw new Error("中间件必须为函数");
    this.middleware.push(fn);
    return this;
  }

  /**
   * todo 组装中间件，实现递归调用
   * todo 提供闭包函数
   * todo 组件 res,res 对象到 ctx 中
   * todo 中间件的调用
   */
  callback() {
    const fn = compose(this.middleware);

    const requestHandle = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.requestHandle(ctx, fn);
    };

    return requestHandle;
  }

  /**
   * 错误信息统一处理
   * 返回信息封装
   */
  requestHandle(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;

    const errorHandle = err => this.onError(err);
    const resHandle = () => respond(ctx);
    return fnMiddleware(ctx)
      .then(resHandle)
      .catch(errorHandle);
  }

  onError(error) {
    console.error(error);
  }

  // 封装context对象
  createContext(req, res) {
    let context = Object.create(null);
    const request = (context.request = Object.create(this.request));
    context.app = this;
    context.req = request.req = req;
    context.res = res;
    return context;
  }

  // 创建服务，监听端口
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
}

function respond(ctx) {
  const { res } = ctx;
  let { body } = ctx;
  if (typeof body === "object") body = JSON.stringify(body);
  return res.end(body);
}

module.exports = Koa;
