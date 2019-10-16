const Koa = require("./koa");
const app = new Koa();

app.use(async ctx => {
  ctx.body = "hello word";
});

app.listen(3000, () => {
  console.log("服务器启动成功");
});
