## 简介
nodejs连接redis数据库，进行基础类型数据操作。

### 实现功能
1. 封装redis对象
2. 实现string类型的set,get方法
3. 实现加锁，解锁

### 备注
redis模块不支持promise处理，需要自己单独进行封装，这里不建议使用，推荐使用ioredis