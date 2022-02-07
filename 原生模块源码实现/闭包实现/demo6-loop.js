const help = {
  context: ""
};

let button = {};

function showHelp(val) {
  help.context = val;
}

function setupHelp() {
  const helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" }
  ];

  for (var i = 0; i < helpText.length; i++) {
    /**
     * 由于所有产生的 onfocus 函数都公用一个外部函数作用域
     * 如果 item 使用 var 声明，会使所有 onfocus 函数引用的item都为一个，即最终的 key 为 age
     */
    var item = helpText[i];
    const onfocus = function() {
      showHelp(item.help);
    };
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
/**
 * 输出信息如下
Your age (you must be over 16)
Your age (you must be over 16)
Your age (you must be over 16)
 */
