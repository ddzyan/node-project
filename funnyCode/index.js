let a = 1;
let b = 2;

[a, b] = [b, a];
console.log(a, b);

const set = new Set();
set.add([1]);
set.add([1]);
set.add([1]);
console.log(set.size);
console.log(set.values());

const map = new Map();
map.set([1], '123123');
console.log(map.get([1]));
console.log(map.values());

console.log(Object.is(3, 3.0));
console.log(Object.is([1], [1]));
