class AddOperation {
  constructor() {}

  operation(numberA, numberB) {
    return numberA + numberB;
  }
}

class SubOperation {
  constructor() {}

  operation(numberA, numberB) {
    return numberA - numberB;
  }
}

class Context {
  constructor(Operation) {
    this.strategy = new Operation();
  }

  doOperation(numberA, numberB) {
    return this.strategy.operation(numberA, numberB);
  }
}

const ctx1 = new Context(AddOperation);
console.log(ctx1.doOperation(1, 2));

const ctx2 = new Context(SubOperation);
console.log(ctx2.doOperation(3, 1));
