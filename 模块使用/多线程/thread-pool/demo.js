function timerOut() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('hello');
      console.log('timerOut');
    }, 3000);
  });
}

module.exports = timerOut;
