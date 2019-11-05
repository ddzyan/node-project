/**
 * 采用闭包解决demo6存在的问题
 *
 * 当然最快的方法是使用 let 或者 const 申明，来去除共享变量的问题
 */
const help = {
  context: ""
};

let button = {};

function showHelp(val) {
  help.context = val;
}

/**
 * 采用闭包的方式，将传入的参数保存在闭包作用域中，不受为界影响
 */
function makeHelpCallback(help) {
  return function() {
    showHelp(help);
  };
}

function setupHelp() {
  const helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" }
  ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    const onfocus = makeHelpCallback(item.help);
    button[item.id] = {
      onfocus
    };
  }
}

setupHelp();

button["email"].onfocus();
console.log(help.context);
button["name"].onfocus();
console.log(help.context);
button["age"].onfocus();
console.log(help.context);
