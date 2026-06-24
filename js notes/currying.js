// Currying transforms a multi-argument function into a chain of unary functions, each waiting for one argument at a time.

// Manual curried function
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6
const add1 = add(1); // partially applied — waits for b and c
const add1and2 = add1(2); // waits for c
add1and2(3); // 6

// Generic curry utility
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // enough args collected?
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6 — also works (partial application hybrid)

// Currying enables: partial application, point-free style, composable specialized functions.

// 💡 Currying vs Partial Application: currying always breaks a function into unary steps. Partial application pre-fills SOME arguments and returns a function waiting for the rest.


// Both techniques create specialized functions from general ones — but differ in how arguments are collected.


// Partial Application — pre-fill SOME args
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const add = (a, b, c) => a + b + c;
const add10 = partial(add, 10);         // pre-fill first arg
const add10and20 = partial(add, 10, 20); // pre-fill two args


add10(5, 3);     // 18 — takes remaining 2 args AT ONCE
add10and20(7);   // 37 — takes remaining 1 arg


// Currying — always ONE arg at a time
const curriedAdd = a => b => c => a + b + c;
curriedAdd(1)(2)(3); // 6 — strictly one at a time


// Practical partial application with bind()
function greet(greeting, punct, name) {
  return ${greeting}, ${name}${punct};
}
const hello = greet.bind(null, 'Hello', '!'); // partial via bind
hello('Alice'); // 'Hello, Alice!'
hello('Bob');   // 'Hello, Bob!'


// Summary:
// Currying: f(a, b, c) → f(a)(b)(c) — each call takes exactly ONE argument

// Partial application: f(a, b, c) → f(a, b)(c) — pre-fill any number of args


// 💡 In practice, curried functions support partial application too (you can call with multiple args and they accumulate). The distinction is mostly theoretical.