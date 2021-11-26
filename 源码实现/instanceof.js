// instanceof作用：判断一个实例是否是其父类或者祖先类型的实例。
// instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype查找失败，返回 false

/**
 *
 * @param {Object} target
 * @param {Object} origin
 */
function myInstanceOf(target, origin) {
  while (target) {
    if (target.__proto__ === origin.prototype) {
      return true;
    }
    target = target.__proto__;
  }
  return false;
}

console.log('myInstanceOf', myInstanceOf([1, 2, 3], Number));
