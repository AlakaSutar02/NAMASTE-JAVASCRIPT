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







