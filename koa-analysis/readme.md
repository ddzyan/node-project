## 使用

```shell
yarn

node ./server.js

curl http://localhost:3000/id?id=1
```

## koa 源码解析

重点是实现了中间件的洋葱模型递归调用，中间件执行流程：
![image](http://www.zmscode.cn/mdImages/koa-design.png)

核心实现实现内容：

1. Koa:基础类型

   1. 中间件添加--use
   2. 服务启动，端口监听 ---listen
   3. 回调函数封装--- callback
      1. 组装中间件：接收 ctx 对象洋葱模型调用，返回 promise 对象
      2. ctx 封装 req,res 对象
      3. 执行中间件
         1. 错误信息统一处理
         2. 正确信息统一处理

2. koa-compose:中间件封装，通过 next 实现洋葱模型调用
3. 封装 request
   1. 提供 url,origin,method 等属性设置和获得方法
   2. 提供 query 属性，内部封装将原生 request.query 属性转换为对象，方便获取 GET 参数
   3. 提供 body 属性，获得 post 方法传递的参数(重点)
   4. 优化 bodyparser 方法，只有在非 GET method 的情况下，才监听 req 的事件
4. 封装 context 对象
   1. 使用事件委托模式，将 request 的方法和属性委托给 context 对象

## 注意

koa2 基础框架不支持直接获得 POST 请求的参数，需要使用 koa-bodyparser 中间件

```js
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());
```

经过中间件解析后，请求参数会被绑定在 request.body 属性上
