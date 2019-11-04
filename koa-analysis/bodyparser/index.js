/**
 * 中间件
 * 解析 Post 方法 传递的参数
 */

const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

/**
 * 每次http请求，都会产生一个新的http stream 对象,用于接收数据
 * 获取POST 方法数据传输结果
 * 并且绑定再 ctx.req.body 属性上
 */
module.exports = function() {
  return async function bodyParser(ctx, next) {
    const body =
      ctx.request.method === "GET" ? {} : parse(await parseBody(ctx.req));
    ctx.req.body = body;
    await next();
  };
};

/**
 * 监听 req Stream 事件
 * 返回数据传输结果
 */
function parseBody(req) {
  let data = [];
  return new Promise((resolve, reject) => {
    req.setEncoding("utf-8");
    req.on("data", thunk => {
      data.push(thunk);
    });

    req.on("end", () => {
      return resolve(data.toString("utf-8"));
    });

    req.on("error", err => {
      reject(err);
    });
  });
}

function parse(str) {
  if (!str) return {};
  // 判断返回结果是否符合json格式
  if (!strictJSONReg.test(str)) {
    throw new Error("invalid JSON, only supports object and array");
  }
  return JSON.parse(str);
}
