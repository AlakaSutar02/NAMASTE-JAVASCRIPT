function once(fn) {
  let isCalled = false;
  let cachedRes;

  return function (...args) {
    if (!isCalled) {
      try {
        cachedRes = fn.apply(this, args);
        isCalled = true;
      } catch (error) {
        throw error;
      }
    }

    return cachedRes;
  };
}
module.exports = once;

// function add(a, b) {
//   console.log("Function is called");
//   return a + b;
// }

// const addOnce = once(add);
// console.log(addOnce(2, 3)); // Output: Function is called \n 5
// console.log(addOnce(4, 5)); // Output: 5 (cached result, function is not called again)
