/**
实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
*/

function add() {
  // 使用闭包保存传入参数
  const _args = [...arguments];

  // 返回一个函数，可以持续进行参数传入
  const _add = function (params) {
    _args.push(params);
    return _add;
  };

  // 在这个方法进行最后的结果返回
  _add.toString = function () {
    return _args.reduce((pre, item) => {
      pre += item;
      return pre;
    }, 0);
  };

  return _add;
}

console.log(add(1)(2)(3).toString());
