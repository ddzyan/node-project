const db = require('./redis-client');

console.time('lock');
console.timeLog('lock', '项目启动');
const testLock = async () => {
  // 加锁
  const lockRes = await db.setnxLock('money');
  console.timeLog('lock', '加锁成功');
  if (lockRes) {
    // 加锁成功，执行业务代码
    const oldMoney = await db.get('money');
    const newMoney = Number.parseInt(oldMoney) + 200;
    await db.set('money', newMoney);
    // 获得锁的过期时间
    const lockValue = await db.getLockValue('money');
    if (Number.parseInt(lockValue) > Date.now()) {
      // 执行未超时
      const delRes = await db.unlock('money');
      console.log('分布式锁操作完成', delRes ? '删除成功' : '删除失败');
      console.timeEnd('lock', '操作完成');
    } else {
      // 恢复原来的值
      await db.set('money', oldMoney);
      console.error('业务超时，回滚');
    }
  } else {
    console.error('锁获取失败');
  }
};
testLock();
