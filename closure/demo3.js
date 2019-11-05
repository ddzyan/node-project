/**
 * 使用闭包实现私有变量和私有方法
 *
 * 只有返回的对象可以使用 counter 内部定义的局部变量
 */

const counter = (function() {
  let number = 100;
  function minus(i) {
    number = number - i;
    console.log(number);
  }

  return {
    minusOne() {
      minus(1);
    },
    minusTwo() {
      minus(2);
    }
  };
})();

counter.minusOne();
counter.minusTwo();
