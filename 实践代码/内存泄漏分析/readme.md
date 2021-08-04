## nodejs 内存泄漏分析

使用 heapdump 保存运行时的内存快照，里面只会包含 Nodejs 环境的对象

### demo1 --- 闭包

启动，打印堆快照

```sh
node --expose-gc index.js
```

此时目录下会产生 2 个快照文件，然后再用 devtool 工具进行比较分析，找到增加对象是被谁给引用，找到问题代码
