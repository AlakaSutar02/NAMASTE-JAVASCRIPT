// JS is single-threaded. The call stack runs sync code. Async callbacks go into task queues. The event loop picks tasks when the stack is empty.
// Microtasks (Promises, queueMicrotask) drain completely after each task before the next macrotask runs.
// 💡 Order: Sync → All Microtasks → Next Macrotask → All Microtasks → ...

console.log("1 — sync");

setTimeout(() => console.log("2 — setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("3 — promise 1"))
  .then(() => console.log("4 — promise 2"));

console.log("5 — sync");

// Output:
// 1 — sync
// 5 — sync
// 3 — promise 1     ← microtask, drains before setTimeout
// 4 — promise 2     ← microtask queued by promise 1
// 2 — setTimeout    ← macrotask, last
// Step-by-step trace:

// Script starts (first macrotask). Call stack: [main script]
// '1 — sync' logs → pops
// setTimeout → Web API registers 0ms timer → callback queued to macrotask queue
// Promise.resolve() already resolved → .then('promise 1') queued to microtask queue
// '5 — sync' logs → pops. Script ends. Call stack empty.
// Drain microtasks: 'promise 1' runs → .then('promise 2') queued → 'promise 2' runs → microtask queue empty
// Pick next macrotask: setTimeout callback → '2 — setTimeout'
//  *******************************************************************************************************

// async/await — what it compiles to
async function main() {
  console.log("A");
  await Promise.resolve(); // suspends here
  console.log("B"); // runs as microtask continuation
}

main();
console.log("C");

// Output: A, C, B

// async/await is syntactic sugar for Promises. The await expression pauses the async function, returning a Promise.
// The rest of the function runs as a microtask when the awaited Promise resolves.

//  *******************************************************************************************************

//promise microstack runs before setTimeout macrotask, even if the promise is resolved after the timeout is scheduled.
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end");

// output: start, end, promise, timeout

//  *******************************************************************************************************

// Nested setTimeout creates new macrotask
setTimeout(() => {
  console.log("outer");
  setTimeout(() => console.log("inner"), 0);
}, 0);
console.log("sync");

// output: sync, outer, inner

//  *******************************************************************************************************
let x = 0;
Promise.resolve().then(() => {
  x = 1;
});
console.log(x); // output: 0 — promise microtask hasn't run yet

//  *******************************************************************************************************

console.log("1");
setTimeout(() => console.log("2"), 0);
queueMicrotask(() => console.log("3"));
console.log("4");

//output: 1, 4, 3, 2 — microtask runs before macrotask
//  *******************************************************************************************************
