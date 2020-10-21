/*
记录一些不常用的方法，方便日后回顾，增加记忆
*/

// Array
const testArr = [1, 2, 3, 4, 5];

/**
 * 第一个参数为检索的值
 * 第二个为下标位置，将从这个下标开始进行查找
 */
console.log('array includes 1', testArr.includes(1));
console.log('array includes 2', testArr.includes(5, 4));
console.log('array includes 3', testArr.includes(5, -1));


// 判断字符串中是否包含指定值，使用方法与数组一致
const testStr = '1,2,aaa,4,5';
console.log('string includes 1', testStr.includes('aa', 6));
console.log('string includes 2', testStr.includes('aa'));

console.log('slice ----------------------------------------');

const testStr2 = 'hello word!!';
/**
 * 字符串和数组都适用，返回剩余字符串，不修改原内容
 * 第一个参数为起始下标位置
 * 第二个参数为结束下标位置
 */
console.log('slice 1：', testStr2.slice(5));
console.log('slice 2：', testStr2.slice(0, 2));
console.log('slice 3：', testStr2.slice(-2, 1));
console.log(testStr2);

/**
 * 截取字符串，返回截取内容，不会修改字符串本身
 * 第一个参数为起始位置
 * 第二参数为截取长度，默认为字符串长度
 *
 *
 * substring
 * 第一个参数为起始位置下标，第二个参数为结束位置下标
 */
console.log('sub', testStr2.substr(0, 3));
console.log(testStr2);
