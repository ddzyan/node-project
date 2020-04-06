const Redis = require('ioredis');
const { redisConf } = require('../config.json');

const redis = new Redis(redisConf);
const LOCK_PREFIX = 'LOCK:';

const db = {
  /**
   * @description 添加字符串
   * @param {string} key
   * @param {string} value
   * @param {string} expire 过期时间,传入负值则为永久有效
   * @returns {Promise<boolean>} 返回操作结果
   */
  set: async (key, value, expire) => {
    await redis.set(key, value);
    if (Number.isNaN(expire)) {
      await redis.expire(key, expire);
    }

    return true;
  },

  /**
   * @description 获取string value
   * @param {string} key redis-key
   * @param {Function} cb 回调函数
   * @returns {Promise<string>} value
   */
  get: async (key) => {
    const value = await redis.get(key);
    return value;
  },

  /**
   * @description redis分布式锁
   * @param {string} key redis-key
   * @param {number} [expire=60] expire 过期时间,默认60
   * @param {Function} cb 回调函数
   * @returns {Promise<boolean>} lock是否成功
   */
  lock: async (key, expire = 60) => {
    try {
      const LOCK_KEY = `${LOCK_PREFIX}${key}`;
      // 锁的value=currentTime+expireTime
      const LOCK_VALUE = Date.now() + 60 * 1000;
      const keyExist = await redis.exists(LOCK_KEY);
      // 若 key 存在返回 1 ，否则返回 0
      if (keyExist) {
        // 检查是否加锁,返回-1则表示没有加锁
        const lockTime = await redis.ttl(LOCK_KEY);
        if (Object.is(lockTime, -1)) {
          const setLockRes = await redis.expire(LOCK_KEY, expire);
          console.log(setLockRes);
        }
        console.log('需要等待%d秒', lockTime);
        return false;
      }
      const setexRes = await redis.setex(LOCK_KEY, expire, LOCK_VALUE);
      return Object.is(setexRes, 'OK');
    } catch (error) {
      throw new Error('加锁异常');
    }
  },


  unlock: async (key) => {
    const delRes = await redis.del(`${LOCK_PREFIX}${key}`);
    return Object.is(delRes, 1);
  },

  getLockExpireTime: async (key) => {
    const res = await redis.get(`${LOCK_PREFIX}${key}`);
    return res;
  },
};


module.exports = db;
