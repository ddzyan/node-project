/**
 * 闭包实现代码
 */
function c() {
  const ccc = 0;
  return function() {
    return ccc;
  };
}

const result = c();
console.log("闭包作用函数使用", result());

const name = "The Window";
const object = {
  name: "My Object",

  getNameFunc: function() {
    return function() {
      return this.name;
    };
  }
};

console.log(object.getNameFunc()());

const object2 = {
  name: "My Object2",

  getNameFunc: function() {
    const that = this;
    return function() {
      return that.name;
    };
  }
};

console.log(object2.getNameFunc()());
