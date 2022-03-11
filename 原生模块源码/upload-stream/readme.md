## 简介
buffer 是一个缓存区，用于保存从磁盘读取的数据，主要为了操作字节，处理二进制数据。

buffer 是一个堆外内存，由node的c++层面提供，js层面负责使用。
1. 当申请的内存小于8kb，则会申请一个固定的内存(8kb)区域，用于保存数据。
2. 再次申请的内存小于8kb时，会继续使用之前申请的内存区域，如果剩余的空间不够，则会再申请一个固定的内存(8kb)区域，上一个内存剩余部分不会继续被使用，当占用的空间被释放后，内存区域则会被释放。（小数据采用了预先申请，时候分配，减少了nodejs和系统之间的申请和调用操作）
3. 当申请的内存大于8kb，则会直接申请一个指定大小的内存区域，这个区域被申请数据独占。（大数据直接由C++层面申请，无需事后分配）

stream 是 i/o，网络操作中传输的数据。
```js
const readStream = fs.createReadStream('./data.txt',{
  highWaterMark:60*1024;
})
```

fs.createReadStream 工作方式是预先创建指定大小的Buffer(大小由highWaterMark控制)，然后使用fs.read()逐步从磁盘中将字节数据拷贝到Buffer中。每一次完成后，会创建一个新的小Buffer，将Buffer数据通过slice()方法拷贝到新的Buffer中，传递给调用对象，触发data事件。在每次拷贝中，如果Buffer对象有剩余，则继续使用，如果不够，则申请一个新的Buffer。

每次读取的大小由 highWaterMark 决定，highWaterMark 的大小会影响触发data事件的次数，经过测试，highWaterMark值越大，读取速度越快。

通过以上得出，stream内部还是通过buffer实现。