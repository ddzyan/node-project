const { parentPort, workerData } = require('worker_threads');

function task(params) {
  const { start, range } = params;
  console.log(start);
  const primes = [];
  let isPrime = true;
  const end = start + range;
  for (let i = start; i < end; i++) {
    for (let j = 2; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
  return primes;
}

function firstTask(workerData) {
  const workParam = process.argv.slice(2);
  await task(workParam);
}

const data = firstTask(workerData);
parentPort.postMessage(data);
