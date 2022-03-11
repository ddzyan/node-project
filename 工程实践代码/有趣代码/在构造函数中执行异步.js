const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms * 1000);
  });
};

class A {
  constructor() {
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.init();
  }

  async init() {
    // 异步操作
    await sleep(2);
    this.resolve();
  }

  ready() {
    return this.readyPromise;
  }
}

(async () => {
  const a = new A();
  console.time("saaa");
  await a.ready();
  console.timeEnd("saaa");
})();
