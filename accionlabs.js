// what is prototype?
// array methods
// what array destructuring is and how to use it in javascript
// what is spread operator and rest operator in javascript
// Remove the first item of an array using array destructuring in JavaScript [1,2,3,4,5]
// build add to cart functionality using closure
// write custom validator function in angular and how will you use it to show inline error. e.g. emailValidator
// write custom directive which will have info-icon whith hover show the tooltip with input field that show info icon red if age is grater than 20.
// css design pattern. how you will implement the theme in angular application.

function HandleCartValue() {
  let cartItem = 5;
  return {
    incrementCart() {
      cartItem++;
      console.log(cartItem);
    },
    decrementCart() {
      cartItem--;

      console.log(cartItem);
    },
  };
}

const cart = HandleCartValue();
cart.incrementCart();
cart.decrementCart();

//remove the first item of an array using array destructuring in JavaScript

const numbers = [1, 2, 3, 4, 5];

const [, ...rest] = numbers;
console.log(rest); // Output: [2, 3, 4, 5]

const [first, ...remaining] = numbers;
console.log(first); // Output: 1
console.log(remaining); // Output: [2, 3, 4, 5]
