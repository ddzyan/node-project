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
