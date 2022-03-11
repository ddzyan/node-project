const timer = function () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}
console.time('start')

// 并发执行，当迭代的promise对象全部为 成功状态 则返回结果为数组，或者其中有一个为 失败状态 则返回错误结果
Promise.all([timer(), timer()]).then(() => {
  console.timeEnd('start')
})
