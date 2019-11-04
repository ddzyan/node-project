/**
 * 采用事件委托方式
 * 是 ctx 对象可以访问 req,res对象上的方法和属性
 */

const delegates = require("delegates");

const proto = (module.exports = {});

/**
 * 创建一个委托实例
 * 允许在主机上访问给定的方法 name
 * 创建属性的"访问器"( IE: getter和 setter )，该属性具有已经委派对象上的给定的name。
 */

delegates(proto, "request")
  .method("get")
  .access("query");
