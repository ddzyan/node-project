## koa 源码解析

中间件执行流程：
![image](http://www.zmscode.cn/mdImages/koa-design.png)

核心实现实现内容：

- 服务监听
- 中间件添加
- 实现 ctx 封装 req,res
- 中间件洋葱模型执行流程
- 结果和错误统一处理
