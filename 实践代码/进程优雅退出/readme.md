## 简介
由于nodejs服务是单进程，如果进程出现已经则会导致服务直接奔溃。

在一般nodejs服务更新的时候，如果直接kill进程，会导致用户请求出现异常。

针对以上两个问题，应该对程序服务完善一个异常捕获，优雅处理，平滑重启等措施。主要注意的点如下：
1. 对进程3个异常事件的监听
    1. uncaughtException
    2. unhandledRejection
    3. rejectionHandled
2. 针对 uncaughtException 事件，需要处理如下内容：
    1. 记录错误信息
    2. 关闭服务，停止接收新的请求
    3. 如果进程为集群部署，则需要断开连接
    3. 设置延迟任务，执行关闭和退出进程