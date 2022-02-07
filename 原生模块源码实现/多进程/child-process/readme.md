## 简介

由于 nodejs 是单进程，导致无法充分的利用服务器 CPU 性能。但是我们可以利用 nodejs 自带的 child_process 模块进行多进程部署。

在进行多进程部署和管理时候，要注意和解决如下问题：

1. 多个进程如何监听同一端口
2. 父子进程之间如何通讯
3. 子进程奔溃如何进行优雅的退出和平滑重启
4. 父进程如何防止子进程多次意外退出和重启

以上的所有问题，都将在项目 demo 中进行解决。

### 服务架构
多进程服务架构
![image](http://zmscode.cn/mdImages/multi-process2.png)

工作进程管理
![image](http://zmscode.cn/mdImages/multi-process.jpg)

### 备注

多个进程监听同一个端口，但是端口描述符文件在同一时间只能被一个进程使用，也就是说客户端发送给服务器的请求，只能被一个进程抢占进程处理。

影响进程抢占成功率的是进程 CPU 繁忙程度，但是 nodejs 进程的繁忙是由 CPU 繁忙 + I/O 繁忙组成，可能会存在抢占到的进程 I/0 繁忙，导致进程分配不合理，影响服务执行效率。

使用轮叫调度，进程依次被调用，解决如上问题

```js
const cluster = require("cluster");

cluster.schedulingPolicy = cluster.SCHED_RR;
```

### 测试

```shell
node ./master.js

curl localhost:1377
```
