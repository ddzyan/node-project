/**
 * makeAdd 也可以被理解为是一个工厂函数
 * 它创建了指定的值与它的参数相加的函数
 *
 * add5 和 add10 都是闭包，他们共享相同函数的定义
 * 但是保存了不同的执行环境
 */
function makeAdd(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdd(5);
const add10 = makeAdd(10);

console.log("add5  :", add5(1));
console.log("add10 :", add10(1));
