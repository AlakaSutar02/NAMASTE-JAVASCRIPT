Promise.resolve(2)
  .then((v) => v * 3)
  .then((v) => v + 4)
  .then((v) => console.log(v));

// output: 10 — 2*3+4
// promise channing allows sequential transformations of the resolved value, with each .then() receiving the result of the previous one.

//  *******************************************************************************************************

console.log("a");
new Promise((resolve) => {
  console.log("b");
  resolve();
}).then(() => console.log("c"));
console.log("d");

// output: a, b, d, c — promise executor runs synchronously, .then() callback runs asynchronously as a microtask

// The code starts by logging 'a' to the console. Then, it creates a new Promise. Inside the Promise's executor function,
// it logs 'b' and immediately resolves the Promise. After that, it sets up a .then() callback to log 'c' when the Promise resolves.
// However, this .then() callback is asynchronous and will run later as a microtask. Next, it logs 'd' to the console.

//  *******************************************************************************************************

async function getValue() {
  return 42;
}
const result = getValue();
console.log(result instanceof Promise);
result.then((v) => console.log(v));

// output: true, 42
//  async functions always return a Promise, even if the return value is not a Promise.
// The resolved value can be accessed with .then().

//  *******************************************************************************************************

Promise.reject(42)
  .catch((v) => v + 1)
  .then((v) => console.log(v));

// output: 43 —
// Promise.reject() creates a rejected Promise. The .catch() handles the rejection and returns a new value,
// which is then logged in the subsequent .then().

//  *******************************************************************************************************

Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then(
  (values) => console.log(values.join(",")),
);

// output: 1,2,3
// Promise.all() waits for all Promises to resolve and returns an array of their values.

//  *******************************************************************************************************

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("err"),
  Promise.resolve(3),
]).then((results) => {
  console.log(results[0].status);
  console.log(results[1].status);
  console.log(results[1].reason);
});

// output: fulfilled, rejected, err
// Promise.allSettled() waits for all Promises to settle (either fulfilled or rejected) and returns an array of their results,
// including status and reason for rejection.
