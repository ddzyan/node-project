/**
 * 函数内部可以访问全局变量
 */
const aaa = 2;

function a() {
  console.log(aaa);
}

a();

/**
 * 函数外部无法访问局部变量
 * 这里定义不能使用声明 ，如果不使用等于定义一个全局变量
 */
function b() {
  const bbb = 3;
}

b();
console.log(bbb);
