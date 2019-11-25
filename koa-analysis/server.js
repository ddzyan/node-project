const Koa = require("./koa");
const bodyparser = require("./bodyparser");
const app = new Koa();

app.use(bodyparser());
app.use(async (ctx, next) => {
  console.log("获取 POST 请求参数", ctx.request.body);
  console.log("获取 GET 请求参数", ctx.query);
  ctx.body = "hello";
  await next();
  ctx.status = 200;
  ctx.body = Buffer.from(ctx.body);
});

app.use(async ctx => {
  ctx.body = ctx.body + " word";
});

app.listen(3000, () => {
  console.log("服务器启动成功");
});
