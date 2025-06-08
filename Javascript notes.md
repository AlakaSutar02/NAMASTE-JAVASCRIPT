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


## 📖 Episode 2: JS Execution & the Call Stack
🧠 Episode 2: JS Execution & the Call Stack
When a JavaScript program runs, it first creates a Global Execution Context (GEC), which is initialized in two phases:

🔹 1. Memory Creation Phase
In this phase, JavaScript allocates memory for:

Variables → initialized as undefined.

Functions → the entire function code is stored in memory.

Consider the example:

var n = 2;
function square(num) {
  var ans = num * num;
  return ans;
}
var square2 = square(n);
var square4 = square(4);

Step-by-step:

var n → memory allocated with value undefined.

function square → entire function is stored in memory.

square2 and square4 → both initialized as undefined.

This completes the Memory Creation Phase.

🔹 2. Code Execution Phase
var n = 2 → n is updated from undefined to 2.

Nothing is done for the function until it’s invoked.

When square(n) is called:

A new Execution Context is created for the square function.

It goes through its own memory creation phase (variables num, ans initialized with undefined).

Then, during execution:

num = 2

ans = num * num = 4

return ans returns 4 and the execution context is destroyed.

The same process repeats for square(4).

🧰 The Call Stack
JavaScript uses a Call Stack to manage multiple execution contexts:

When a function is invoked, a new context is pushed onto the stack.

When it completes, it's popped off the stack.

📚 Other names for the Call Stack include:

Program Stack

Control Stack

Runtime Stack

Execution Context Stack



📌 Episode 3: Hoisting in JavaScript (Variables & Functions)
In many programming languages, referencing a variable before it's declared throws an error. However, in JavaScript, due to hoisting, such code does not always fail.

🧠 What is Hoisting?
Hoisting is JavaScript’s default behavior of moving declarations (not initializations) to the top of their scope during the memory creation phase of the execution context.

Variables declared with var are hoisted with an initial value of undefined.

Function declarations are hoisted with their entire function definition.

🔍 Example 1:
js
Copy
Edit
getName();         // Outputs: "Namaste Javascript"
console.log(x);    // Outputs: undefined

var x = 7;
function getName() {
  console.log("Namaste Javascript");
}
getName() works because the entire function is hoisted.

x is hoisted but initialized to undefined.

❗ Important Note
If you remove the declaration var x = 7, and just try console.log(x);, it throws:

csharp
Copy
Edit
Uncaught ReferenceError: x is not defined
Because without a declaration, no memory is reserved for x.

🔍 Example 2:
js
Copy
Edit
getName();               // TypeError: getName is not a function
console.log(getName);    // undefined

var getName = function () {
  console.log("Namaste JavaScript");
};
In this case, getName is treated as a variable assigned to a function expression.

During hoisting, it is set as undefined, hence calling it as a function before initialization throws a TypeError.

📌 Episode 4: Functions & Variable Environments
In JavaScript, each function invocation creates a new execution context with its own memory and code components. Variables declared inside a function are scoped locally.

🔍 Example:
js
Copy
Edit
var x = 1;
a();
b();
console.log(x); // 1

function a() {
  var x = 10;
  console.log(x); // 10
}

function b() {
  var x = 100;
  console.log(x); // 100
}
🧭 Output:
Copy
Edit
10
100
1
🔄 Execution Context Flow:
A Global Execution Context (GEC) is created.

In the memory phase, JS allocates memory:

x → undefined

a → function code

b → function code

In the execution phase:

x is assigned 1

a() is invoked:

Creates a new execution context

Local variable x is undefined → then assigned 10

Logs 10

Local context is destroyed

b() is invoked:

New execution context with local x = 100

Logs 100

Local context is destroyed

Logs global x, which is still 1

📦 Call Stack Visualization:
markdown
Copy
Edit
Call Stack (at runtime):
1. GEC
2. GEC → a()
3. GEC
4. GEC → b()
5. GEC
6. (Program ends)

