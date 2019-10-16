/*
  ! 你可以试试的嘛？
  ? 你不知道对错
  Todo this function
  Todo this function
  //试试
  * 你又不会死
  */

function compose(middleware) {
  if (!Array.isArray(middleware)) throw new Error("传入的参数必须为数组");
  for (const fn of middleware) {
    if (typeof fn !== "function") throw new Error("中间件必须为函数");
  }

  return function(context, next) {
    // 实现递归回调
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) throw new Error("遍历的范围不能小于0");
      let fn = middleware[i];

      if (i === middleware.length) fn = next;

      try {
        return Promise.resolve(
          fn(context, function next() {
            // 执行下一个回调函数
            return dispatch.bind(null, i + 1);
          })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

module.exports = compose;
