const Benchmark = require("benchmark");

const suite = new Benchmark.Suite();

function toNumber1(str) {
  return +str;
}

function toNumber2(str) {
  return Number.parseInt(str);
}

function toNumber3(str) {
  return Number(str);
}

// add tests
suite
  .add("+", function() {
    toNumber1("1");
  })
  .add("Number.parseInt", function() {
    toNumber2("1");
  })
  .add("Number", function() {
    toNumber3("1");
  })
  // 监听每个事件完成后的输出
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });
