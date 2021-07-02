const path = require('path');
const fs = require('fs');

const fileQueue = {
  list: {},
  lock_list: {},
};

fileQueue.lock_list = new Proxy(
  {},
  {
    get(obj, prop) {
      return prop in obj ? obj[prop] : -1;
    },
    // obj 对象本身，prop
    set(obj, prop) {
      if (!fileQueue.list[prop].length) {
        obj[prop] = 0;
        return;
      }

      // 锁定文件，保证同时只有一个文件开始写入
      obj[prop] = 1;
      const option = fileQueue.list[prop].pop();
      const params = [
        option.option.file,
        option.option.data || '',
        option.option.code || 'utf8',
        (err, data) => {
          fileQueue.lock_list[prop] = 0;
          if (err) {
            option.fail && option.fail(err);
            return;
          }
          option.success && option.success(data);
        },
      ];
      if (option.option.add) {
        fs.appendFile(...params);
      } else {
        fs.writeFile(...params);
      }
    },
  },
);

module.exports = {
  read(fileName) {
    return fs.readFileSync(fileName, 'utf-8');
  },
  write(option, success, fail) {
    let { filePath, data } = option;
    if (!filePath) {
      throw new Error('请输入文件地址');
    }
    filePath = path.resolve(option.file);

    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    if (!fileQueue.list[filePath]) {
      fileQueue.list[filePath] = [];
    }
    fileQueue.list[filePath].push({ option, success, fail });
    if (!fileQueue.list.lock_list[filePath]) {
      fileQueue.list.lock_list[filePath] = 1;
    }
  },
};
