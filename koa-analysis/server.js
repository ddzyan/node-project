const Koa = require("./koa");
const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = "hello";
  await next();
  ctx.body = {
    data: ctx.body
  };
});

app.use(async ctx => {
  ctx.body = ctx.body + " word";
});

app.listen(3000, () => {
  console.log("服务器启动成功");
});
