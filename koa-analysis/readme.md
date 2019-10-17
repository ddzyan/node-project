## koa 源码解析

中间件执行流程：
![image](http://www.zmscode.cn/mdImages/koa-design.png)

核心实现实现内容：

1. Koa:基础类型

   1. 中间件添加
   2. 服务启动，端口监听
   3. 组装中间件,ctx 封装 req,res , 执行中间件
   4. 错误信息，返回信息统一处理

2. koa-compose:中间件封装，通过 next 实现洋葱模型调用
