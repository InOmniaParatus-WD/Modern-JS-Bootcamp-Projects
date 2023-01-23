const counterObject = require("./myscript.js");

console.log(counterObject.getCounter()); // 0
counterObject.incrementCounter();
console.log(counterObject.getCounter()); // 1

const newCounterObject = require("./myscript.js");
console.log(newCounterObject.getCounter()); // 1
