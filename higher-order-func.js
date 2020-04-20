const sum = (a,b) => a + b

const operate = func => (a,b) => `the ${func.name} of ${a} and ${b} is ${func(a,b)}`
// function operate(func) {
//   return function inner(a,b) {
//     return `the ${func.name} of ${a} and ${b} is ${func(a,b)}`
//   }
// }
const getSum = operate(sum);

console.log(getSum(3,4));