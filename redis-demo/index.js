const db = require('./redis-client');

db.lock('money').then((res) => {
  console.log('加锁结果', res);
  db.unlock('money').then((unlockRes) => {
    console.log('解锁结果', unlockRes);
  });
}).catch((err) => {
  console.error('加锁失败', err);
});
