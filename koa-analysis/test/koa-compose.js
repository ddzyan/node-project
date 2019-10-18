function compose(md) {
  if (!Array.isArray(md)) throw new Error("参数必须为数组");
  for (const fn of md) {
    if (typeof fn !== "function") throw new Error("中间件必须是函数");
  }

  return function(ctx) {
    const index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) throw new Error("超出数组边界");
      const fn = md[i];
      try {
        return Promise.resolve(
          fn(ctx, function() {
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
