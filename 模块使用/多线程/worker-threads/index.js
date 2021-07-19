const { Worker, isMainThread } = require('worker_threads');

function createWork(myStart, range) {
  // 需要保证文件的唯一性
  return new Worker('./template.js', {
    workerData: { reqRecord: myStart, range },
  });
}

if (isMainThread) {
  const max = 1e7;
  const min = 2;
  let primes = [];

  const threadCount = +process.argv[2] || 2;
  const threads = new Set();
  console.log(`Running with ${threadCount} threads...`);
  const range = Math.ceil((max - min) / threadCount);
  let start = min;

  // 创建线程
  for (let i = 0; i < threadCount - 1; i++) {
    const myStart = start;
    threads.add(createWork(myStart, range));
    start += range;
  }

  // 创建线程监听
  for (const worker of threads) {
    worker.on('error', (err) => {
      throw err;
    });

    worker.on('exit', () => {
      threads.delete(worker);
      console.log(`Thread exiting, ${threads.size} running...`);
      if (threads.size === 0) {
        console.log(primes.join('\n'));
      }
    });

    worker.on('message', (msg) => {
      primes = primes.concat(msg);
    });
  }
}
