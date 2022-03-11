const asyncPromise = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000)
  })
}

asyncPromise().then(() => {
  console.log('执行异步任务');
})