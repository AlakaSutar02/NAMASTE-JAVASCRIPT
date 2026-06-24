// setTimeout registers a timer, returns a timer ID, and continues immediately
const timerId = setTimeout(() => {
  console.log("later");
}, 1000);

console.log("now"); // runs immediately
console.log(timerId); // a number — the timer ID (for clearTimeout)

// Output:
// now
// 1
// later (after 1 second)

// The browser/Node registers a timer with the OS.
// setTimeout returns immediately with a timer ID.
// After the delay elapses, the callback is placed in the macrotask queue.
// When the call stack is empty, the event loop pulls the callback and runs it.

//**********************************************************************************

// setTimeout and the event loop — the full picture
console.log("1");

setTimeout(() => console.log("2 — setTimeout A"), 0);

Promise.resolve().then(() => {
  console.log("3 — Promise microtask");
  setTimeout(() => console.log("4 — setTimeout B"), 0);
});

setTimeout(() => console.log("5 — setTimeout C"), 0);

console.log("6");

// Trace:
// Sync code: logs 1, registers timer A, registers microtask, registers timer C, logs 6
// Microtask queue: [Promise handler]
// Macrotask queue: [timer A, timer C]
//
// Call stack clears → drain microtasks:
//   → logs 3, registers timer B → macrotask queue: [A, C, B]
// Microtask queue empty → run macrotask A: logs 2
// Drain microtasks (empty) → run macrotask C: logs 5
// Drain microtasks (empty) → run macrotask B: logs 4
//
// Final output: 1, 6, 3, 2, 5, 4

//**********************************************************************************
// setInterval: fires every N ms from when it was SET, regardless of callback duration
