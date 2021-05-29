const deepClone = (o) => {
  if (Array.isArray(o)) {
    let flag = []
    o.forEach(item => flag.push(item))
    return flag
  } else if (typeof o === 'object') {
    let flag = {}
    for (let i in o) {
      flag[i] = deepClone(o[i])
    }
    return flag
  } else {
    return o
  }
}

const apple = { a: { c: 1 }, b: 2 }
const newApple = deepClone(apple);
console.log(apple === newApple)
console.log('apple', apple)
console.log('newApple', newApple)