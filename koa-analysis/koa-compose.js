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

  return function(context, next) {
    let index = -1;
    return dispatch(0);
    /**
     * @return 返回结果为 Promise对象
     */
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = md[i];
      if (i === md.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        // 执行中间件，并且传入next() 函数，用于执行下一个中间
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

module.exports = compose;
