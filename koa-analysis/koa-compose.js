/**
 * //todo 参数类型判断
 * todo 返回 闭包函数 ，封装递归调用 ， 参数为 context
 * todo 递归实现，实现洋葱模型调用，中间件返回 Promise 对象
 */

/**
 *
 * @param {array} md
 * @returns {Promise} 执行结果
 */
function compose(md) {
  if (!Array.isArray(md)) throw new Error("参数必须为数组");
  for (const fn of md) {
    if (typeof fn !== "function") throw new Error("中间件必须是函数");
  }

  return function(context) {
    const index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) throw new Error("超出数组边界");
      let fn = md[i];
      if (i === md.length) fn = next;
      try {
        return Promise.resolve(
          fn(context, function() {
            /**
             * 执行下一个回调函数
             * 执行完毕后，再执行原函数剩余部分，实现洋葱模型
             */
            return dispatch(i + 1);
          })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

module.exports = compose;
