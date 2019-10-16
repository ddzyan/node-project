## koa 源码解析

核心实现实现内容：

### 服务的创建

koa 的服务配置代码就是对 http 模块的封装，具体如下：

```js
/**
 * koa/application.js 74行
 */
listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
});
```

### 中间件递归实现