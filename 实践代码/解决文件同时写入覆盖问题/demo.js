const fs = require('fs');

const params = [
  'config.json',
  '{"data": "123456123456"}',
  'utf-8',
  function (err, data) {
    if (err) {
      this.fail && this.fail(err);
      return;
    }
    this.success && this.success(data);
  }.bind({
    success(data) {
      console.log('success');
    },
  }),
];

fs.writeFile(...params);

params[1] = '{"data": "123123"}';
fs.writeFile(...params);
