function compose(md) {
  if (!Array.isArray(md)) throw new Error("传入参数必须是数组");
  for (const fn of md) {
    if (typeof fn !== "function") throw new Error("中间件必须是函数");
  }

  return function(context, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) throw new Error("flag is error");
      const fn = md[i];
      if (i === md.length) fn = next;
      try {
        return Promise.resolve(
          fn(context, function() {
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
