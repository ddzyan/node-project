## 简介

打印应用程序对的垃圾回收日志，了解垃圾回收过程

### 操作 1

```
node --trace_gc -e "var a = [];for(var i=0;i<1000000;i++)a.push(new Array(100));" > gc.log
```

产生 gc.log 日志文件

#### 输出

```log
[8844:000001913E9E7A60]       48 ms: Scavenge 2.5 (4.2) -> 2.2 (5.2) MB, 1.1 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
[8844:000001913E9E7A60]       61 ms: Scavenge 2.7 (5.2) -> 2.7 (6.2) MB, 1.2 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
[8844:000001913E9E7A60]       89 ms: Scavenge 3.9 (6.2) -> 3.7 (9.2) MB, 0.7 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
[8844:000001913E9E7A60]       91 ms: Scavenge 5.1 (9.2) -> 5.1 (9.7) MB, 1.1 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
[8844:000001913E9E7A60]       93 ms: Scavenge 5.6 (9.7) -> 5.6 (15.7) MB, 1.5 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
[8844:000001913E9E7A60]       97 ms: Scavenge 8.9 (15.7) -> 8.9 (15.7) MB, 1.6 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
[8844:000001913E9E7A60]      100 ms: Scavenge 9.5 (15.7) -> 9.3 (26.7) MB, 2.8 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
```

### 操作 2

```
node --prof test1.js
```

产生 isolate-0000024F34356E80-v8.log 类似的日志文件
