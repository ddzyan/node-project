/*
callback（一个在数组中每一项上调用的函数，接受四个函数：）
  previousValue（上一次调用回调函数时的返回值，或者初始值）
  currentValue（当前正在处理的数组元素）
  currentIndex（当前正在处理的数组元素下标）
  array（调用reduce()方法的数组）
initialValue（可选的初始值。作为第一次调用回调函数时传给previousValue的值）
*/

Array.prototype.myReduce = function (func, initValue) {
  const res = initValue || [];

  const arr = this;
  for (const key in arr) {
    if (Object.prototype.hasOwnProperty.call(arr, key)) {
      func(res, arr[key], key, arr);
    }
  }

  return res;
};

const arr = [1, 2, 3];

const newArr = arr.myReduce(
  (pre, item) => {
    pre.push(item * 3);
    return pre;
  },
  [10],
);

console.log('new Array', newArr);
