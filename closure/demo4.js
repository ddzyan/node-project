/**
 * 使用闭包实现一个共享变量(也可以理解为私有变量)
 *
 * 每次函数执行操作的都是同一个变量，并且这个变量无法被外界获取和修改
 */
const counter = function() {
  let number = 0;

  return function() {
    number++;
    console.log(number);
  };
};

const a = counter();
a();
a();
