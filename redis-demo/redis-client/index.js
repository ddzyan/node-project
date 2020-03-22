const redis = require('redis');
const { redisConf } = require('../config.json');

const redisClient = redis.createClient(redisConf)

// 监听redis服务器发出的任何报错信息
redisClient.on("error", function (error) {
  console.error("RedisServer is error!", error);
});

// 监听连接成功
redisClient.on("connect", function () {
  console.log("RedisServer is connected!");

});

// 监听连接断开
redisClient.on("end", function () {
  console.log("RedisServer is end!");
});

const db = {
  /**
   * @description 添加字符串
   * @param {string} key 
   * @param {string} value 
   * @param {string} expire 过期时间,传入负值则为永久有效
   * @param {Function} cb 回调函数
   * @returns {Function} cb(error, reply)
   */
  set: (key, value, expire, cb) => {
    redisClient.set(key, value, (error, reply) => {
      if (error) {
        return cb(error, null);
      }

      // 判断是否为数字
      if (isNaN(expire) && expire > 0) {
        redisClient.expire(key, Number.parseInt(expire));
      }

      return cb(null, reply);
    })
  },

  get: (key, cb) => {
    redisClient.get(key, (error, result) => {
      if (error) {
        return cb(error, null);
      }
      return cb(null, result);
    })
  }
}


module.exports = db;