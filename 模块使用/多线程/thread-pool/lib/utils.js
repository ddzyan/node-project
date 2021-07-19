const jsFileRegexp = /\.js$/;

const isFunction = function (func) {
  return typeof func === 'function';
};

function isJSFile(file) {
  return jsFileRegexp.test(file);
}
module.exports = {
  isFunction,
  isJSFile,
};
