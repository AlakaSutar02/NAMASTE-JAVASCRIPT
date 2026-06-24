// Arrow callback inside method preserves this

const timer = {
  seconds: 0,
  start() {
    const tick = () => ++this.seconds;
    tick();
    tick();
    tick();
    return this.seconds;
  },
};
console.log(timer.start());

//An IIFE is a function that is both defined and invoked immediately. It creates an isolated scope.

// Classic IIFE syntax
(function () {
  const private = "inaccessible outside";
  console.log(private);
})();

// Arrow IIFE
(() => {
  // isolated scope
})();

// IIFE with parameters
(function (global) {
  global.myLib = {};
})(window);

// IIFE returning a value
const result = (() => {
  const x = computeExpensiveThing();
  return x * 2;
})();

// Use cases:

// Avoid polluting global scope (classic library pattern)

// Create truly private variables (module pattern)

// Capture loop variables (pre-let closure fix)

// One-time initialization logic
