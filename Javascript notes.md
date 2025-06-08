# 📘 JavaScript Mastery Notes

A collection of conceptual deep-dives from **Namaste JavaScript** (Episodes 1–21), covering topics like execution context, closures, event loop, and promises.

---

## 📚 Table of Contents

1. [Episode 1: Execution Context](#episode-1-execution-context)
2. [Episode 2: JS Execution & the Call Stack](#episode-2-js-execution--the-call-stack)
3. [Episode 3: Hoisting](#episode-3-hoisting)
4. [Episode 4: Functions & Variable Environments](#episode-4-functions--variable-environments)
5. [Episode 5: Global Objects & this](#episode-5-global-objects--this)
6. [Episode 6: undefined vs not defined](#episode-6-undefined-vs-not-defined)
7. [Episode 7: Scope Chain & Lexical Environment](#episode-7-scope-chain--lexical-environment)
8. [Episode 8: let, const, and TDZ](#episode-8-let-const-and-temporal-dead-zone)
9. [Episode 9: Block Scope & Shadowing](#episode-9-block-scope--shadowing)
10. [Episode 10: Closures](#episode-10-closures)
11. [Episode 11: setTimeout & Closures](#episode-11-settimeout-and-closures)
12. [Episode 12: Closure Interview Questions](#episode-12-closure-interview-questions)
13. [Episode 13: Function Types](#episode-13-function-types-in-js)
14. [Episode 14: Callbacks & Event Listeners](#episode-14-callbacks--event-listeners)
15. [Episode 15: Event Loop & Queues](#episode-15-event-loop-web-apis-queues)
16. [Episode 16: JS Engine & V8](#episode-16-js-engine--v8-architecture)
17. [Episode 17: setTimeout Timing Issues](#episode-17-settimeout-trust-issues)
18. [Episode 18: Higher-Order Functions](#episode-18-higher-order-functions)
19. [Episode 19: map, filter, reduce](#episode-19-map-filter-and-reduce)
20. [Episode 20: Callback Hell](#episode-20-callback-hell--inversion-of-control)
21. [Episode 21: Promises](#episode-21-promises)

---

## 📖 Episode 1: Execution Context

📌 Execution Context in JavaScript
In JavaScript, everything runs inside an Execution Context. You can think of it as a sealed-off container where your code is evaluated and executed. It’s an abstract concept that holds information about the environment in which the current code is running.

The Execution Context has two main components:

1. Memory Component (Variable Environment)

    Stores variables and function declarations in a key-value pair format.

    This phase is also known as the Creation Phase.

2. Code Component (Thread of Execution)

    Executes code line-by-line.

    This is also referred to as the Execution Phase or Thread of Execution.

🔁 Characteristics of JavaScript Execution
Synchronous: Executes code in the order it appears (line-by-line).
Single-threaded: Can execute only one task at a time — there’s only one call stack.


## ⚙️ Episode 2: How JavaScript is Executed & the Call Stack

When a JavaScript program starts running, the engine creates a **Global Execution Context (GEC)**.

This execution context is built in **two phases**:

---

### 🔹 1. Memory Creation Phase

In this phase, JavaScript scans through the entire code and:

- Allocates memory to all **variables** and **functions**
- Initializes variables with the value `undefined`
- Stores full **function definitions** in memory

#### 📌 Example:

```js
var n = 2;
function square(num) {
  var ans = num * num;
  return ans;
}
var square2 = square(n);
var square4 = square(4);


🔸 During the memory phase:
n → undefined

square → full function definition stored

square2, square4 → undefined


### 🔹 2. Code Execution Phase

Once memory is allocated, JavaScript begins **executing code line by line**:

1. `n = 2` → updates the value of `n` from `undefined` to `2`
2. `square` is referenced but **not executed yet**
3. `square2 = square(n)` is called:
   - A new **Execution Context** is created for the `square` function
   - Inside this context:
     - `num = 2`
     - `ans = num * num = 4`
     - `return ans` → returns `4` and destroys the function's execution context

4. The same steps repeat for `square(4)`

---

### 📦 Final State Before Complete Teardown

At this point, all function execution contexts have returned their values and been **popped off the stack**. Only the **Global Execution Context** remains until the program finishes.

---

### 🧰 The Call Stack

JavaScript uses a **Call Stack** to manage the order and execution of function calls.

- When a function is called → its **execution context is pushed** onto the stack
- When the function returns → its context is **popped off** the stack

This mechanism ensures that JavaScript follows a predictable **Last-In, First-Out (LIFO)** execution pattern.

#### 📌 Other Names for the Call Stack:
- Program Stack  
- Control Stack  
- Runtime Stack  
- Machine Stack  
- Execution Context Stack
