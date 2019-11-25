/*
 * @Author: dingdongzhao
 * @Date: 2019-11-25 11:39:05
 * @Last Modified by: dingdongzhao
 * @Last Modified time: 2019-11-25 12:49:57
 */

/**
 * 主进程
 * 用于启动子进程，子进程之间的通讯，管理子进程状态
 *
 * 功能如下：
 * 1. 进程创建
 * 2. 进程意外退出处理
 * 3. 进程通讯
 * 3. 限制进程频繁重启
 */

const net = require("net"); // 创建TCP服务
const cp = require("child_process"); // 创建子进程
const cpus = require("os").cpus();

const server = net.createServer().listen(1777);

const works = new Map();

const limit = cpus.length;
const intervalTime = 6 * 1000;
let restart = [];

/**
 * 检查进程是否频繁重启
 *
 * 1. 记录进程启动时间
 * 2. 当记录数量超过上线，则只保存最新的limit条数
 * 3. 当记录数量大于等于limit,并且最新启动时间与第一个启动的时间间隔，大于设置的时间，则返回 true
 */
const isTooManyCreate = function() {
  const time = new Date();
  const length = restart.push(time);
  if (length > limit) {
    restart.slice(limit * -1);
  }

  return (
    restart.length >= limit &&
    restart[restart.length - 1] - restart[0] > intervalTime
  );
};

/**
 * 创建工作进程
 *
 * 在TCP服务创建完毕时，将文件描述符传递给子进程，实现多进程监听统一端口
 * 发送完毕后，关闭主进程服务监听
 *
 * 这里需要注意的是
 * 多进程监听统一端口，但是文件描述符在同一时间只能被一个进程使用，也就是说客服端发送给服务器的请求，只能由一个服务抢占处理。
 */
const createWork = function() {
  // 防止频繁重启
  if (isTooManyCreate()) {
    //process.emit("");
    return;
  }
  const work = cp.fork("./child.js");
  /**
   * 监听子线程退出
   * 退出则删除管理对象
   */
  work.on("exit", function() {
    works.delete(works.pid);
    console.log("work exit :", work.pid);
  });

  /**
   * 接收子进程消息
   *
   * suicide 意外退出则启动一个新的进程
   */
  work.on("message", data => {
    if (data.act === "suicide") {
      console.log("work  uncaughtException exit:", work.pid);
      createWork();
    }
  });

  work.send("server", server);
  works.set(work.pid, work);
};

/**
 * 根据进程数量，创建多进程服务
 */
for (let index = 0; index < cpus.length; index++) {
  createWork();
}

/**
 * 主进程退出，则关闭所有启动的子进程
 */
process.on("exit", function() {
  for (const work of works) {
    work.kill();
  }
});
