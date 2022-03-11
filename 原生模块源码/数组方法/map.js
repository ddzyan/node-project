// 不要使用箭头函数，否则 this 则为 Array
Array.prototype.myForEach = function (func, thisValue) {
  const res = [];
  thisValue = thisValue || [];
  const arr = this;
  for (const key in arr) {
    if (Object.prototype.hasOwnProperty.call(arr, key)) {
      const fn = func.bind(thisValue);
      res.push(fn(arr[key], key, arr));
    }
  }

  return res;
};

const arr = [1, 2, 3];
console.log(
  'new Array',
  arr.myForEach((item) => item + 1),
);
