/**
 * 委托模式也被称为代理模式
 *
 * 对 proxy  对象的 get 和 set 方法进行了代理，也可以称为拦截
 */

const proxy = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    }
  }
);
proxy.count = 1;
//setting count!
++proxy.count;
// getting count!
// setting count!
