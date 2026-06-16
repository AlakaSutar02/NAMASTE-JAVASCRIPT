console.log("Hello, World!");

// The reduce method executes a reducer function (that you provide) on each element of the array, resulting in a single output value.
// It takes two arguments: a callback function and an initial value.

// const arr = [5, 1, 3, 2, 6];
// output = arr.reduce((acc, current) => {
//   if (current > acc) {
//     acc = current;
//   }
//   return acc;
// }, 0);
// console.log(output); // 6
/*******************/
// console.log([5] == [5]);
// console.log([5] === [5]);

// prevent object modification
// Object.freeze() prevents modification of existing property attributes and values, and prevents the addition of new properties.
// It returns the same object that was passed in, but it is now frozen.
let obj = {
  name: "Alka",
  id: "123",
};

obj.name = "sutar";
Object.freeze(obj); // This will prevent any further changes to the object
obj.id = "568";
console.log(obj); // { name: 'sutar', id: '123' }

// The unshift method adds one or more elements to the beginning of an array and returns the new length of the array.

// var arr = [2, 3, 4, 5];
// arr.unshift(1);
// console.log(arr); // 5

//destructuring assignment
// Destructuring assignment is a JavaScript expression that makes it possible to unpack values from arrays or properties from objects into distinct variables.
let arr = [1, 2, 3, 4];
let [a, b, c, d] = arr;
console.log(a, b, c, d); // Output: 1 2 3 4

let fullname = ["Alan", "Rickman"];
let [fname, lname] = fullname;
console.log(fname, lname);
// Output: Alan Rickman

/************************************************************************************************************* 
                          Photon questions
************************************************************************************************************* */

var arr1 = ["a", "b", "c", "d"];
// The forEach method executes a provided function once for each array element.
var res = arr1.forEach((el) => el === undefined);
console.log(res); // Output: undefined

// The filter method creates a new array with all elements that pass the test implemented by the provided function.
// It does not modify the original array.
var res = arr1.filter((el) => el === undefined);
console.log(res); // Output: []

// The difference between == and === is that == checks for value equality, while === checks for both value and type equality.

console.log("5 == '5'", 5 == "5"); // Output: true
// Explanation: == performs type coercion, converting the string "5" to a number before comparison.

console.log('10 + "5"', 10 + "5"); // Output: "105"
// Explanation: The + operator concatenates the number 10 with the string "5", resulting in the string "105".

console.log('10 - "5"', 10 - "5"); // Output: 5
// Explanation: The - operator converts the string "5" to a number before performing the subtraction.

console.log('10 * "5"', 10 * "5"); // Output: 50
// Explanation: The * operator converts the string "5" to a number before performing the multiplication.

console.log('10 / "5"', 10 / "5"); // Output: 2
// Explanation: The / operator converts the string "5" to a number before performing the division.

console.log('10 % "5"', 10 % "5"); // Output: 0
// Explanation: The % operator converts the string "5" to a number before performing the modulus operation.

console.log("10 + true", 10 + true); // Output: 11
// Explanation: The boolean true is converted to the number 1 before performing the addition.

console.log(10 - true); // Output: 9
// Explanation: The boolean true is converted to the number 1 before performing the subtraction.

console.log(10 * true); // Output: 10
// Explanation: The boolean true is converted to the number 1 before performing the multiplication.

console.log(10 / true); // Output: 10
// Explanation: The boolean true is converted to the number 1 before performing the division.

console.log(10 % true); // Output: 0
// Explanation: The boolean true is converted to the number 1 before performing the modulus operation.

console.log(10 + false); // Output: 10
// Explanation: The boolean false is converted to the number 0 before performing the addition.

console.log(10 - false); // Output: 10
// Explanation: The boolean false is converted to the number 0 before performing the subtraction.

console.log(10 * false); // Output: 0
// Explanation: The boolean false is converted to the number 0 before performing the multiplication.

console.log(10 / false); // Output: Infinity
// Explanation: The boolean false is converted to the number 0 before performing the division, resulting in Infinity (division by zero).

console.log(10 % false); // Output: NaN
// Explanation: The boolean false is converted to the number 0 before performing the modulus operation, resulting in NaN (not a number).

console.log("5" + 10); // Output: "510"
// Explanation: The + operator concatenates the string "5" with the number 10, resulting in the string "510".

console.log([1, 2, 3] + [4, 5, 6]); // Output: "1,2,34,5,6"
// Explanation: Both arrays are converted to strings and concatenated.

console.log([1, 2, 3] - [4, 5, 6]); // Output: NaN
// Explanation: Arrays are converted to strings, and "1,2,3" - "4,5,6" results in NaN.

console.log([1, 2, 3] == [1, 2, 3]); // Output: false
// Explanation: Arrays are reference types, so they are compared by reference, not by value.

// console.log([1, 2, 3] === [1, 2, 3]); // Output: false
// Explanation: Strict equality checks reference, not value.

console.log([1, 2, 3] == "1,2,3"); // Output: true
// Explanation: The array is converted to a string before comparison.

// console.log([1, 2, 3] === "1,2,3"); // Output: false
// Explanation: Strict equality checks both type and value.

console.log("true == 'true'", true == "true"); // Output: false
// Explanation: true is boolean, "true" is string. "true" is not converted to boolean or number.

console.log(true === "true"); // Output: false
// Explanation: Different types.

console.log(false == "false"); // Output: false
// Explanation: false is boolean, "false" is string. "false" is not converted to boolean or number.

console.log(false === "false"); // Output: false
// Explanation: Different types.

console.log(true == 1); // Output: true
// Explanation: true is converted to 1.

console.log(true === 1); // Output: false
// Explanation: Different types.

console.log(false == 0); // Output: true
// Explanation: false is converted to 0.

console.log(false === 0); // Output: false
// Explanation: Different types.

console.log(true == "1"); // Output: true
// Explanation: "1" is converted to number 1, true is also 1.

const sales = [
  { product: "Laptop", quantity: 5 },
  { product: "Phone", quantity: 10 },
  { product: "Laptop", quantity: 3 },
  { product: "Tablet", quantity: 2 },
  { product: "Phone", quantity: 7 },
];
//  output
// [
//   { product: "Laptop", quantity: 8 },
//   { product: "Phone", quantity: 17 },
//   { product: "Tablet", quantity: 2 },
// ];

const output = sales.reduce((acc, sale) => {
  const found = acc.find((item) => item.product === sale.product);
  if (found) {
    found.quantity += sale.quantity;
  } else {
    acc.push({ ...sale });
  }
  return acc;
}, []);

console.log(output);

console.log(sales);

// counter with closure prgram increment decrement reset
function createCounter() {
  let count = 0;

  return {
    increment: function () {
      count++;
      console.log("Incremented:", count);
    },
    decrement: function () {
      count--;
      console.log("Decremented:", count);
    },
    getCount: function () {
      return count;
    },
    reset: function () {
      count = 0;
      console.log("Counter reset to:", count);
    },
  };
}

const counter = createCounter();
counter.increment(); // Incremented: 1
counter.increment(); // Incremented: 2
counter.decrement(); // Decremented: 1
counter.reset(); // Counter reset to: 0
