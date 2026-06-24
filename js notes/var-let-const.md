JavaScript var, let, and const Interview Questions
Understanding the differences between var, let, and const is a JavaScript interview staple. Learn scope, hoisting, and reassignment rules.

On this page
1.The Mental Model
2.Deep Explanation
3.Common Mistakes
4.Real-World Usage
5.Cheat Sheet
6.Interview Tips
7.Deep Dives
8.1 Questions
9.Related Topics
The Mental Model
Think of three different kinds of post-it notes. var is the old yellow post-it — you can stick it anywhere in the room and it floats to the top of the room automatically (hoisting). You can write on it as many times as you want. You can even put two with the same label, and the second one silently replaces the first. Convenient, but chaos in a large codebase. let is a whiteboard entry — it stays exactly where you wrote it, in the section of the board you're working on. You can change what it says, but it doesn't exist before you write it, and it disappears when you leave that section. const is a label on a locked drawer. You set it once and you can't relabel it. But if the drawer contains a mutable object (an array or an object literal), you can still change what's inside the drawer — you just can't put a different drawer there.

The Explanation
var — the original, the problematic one
var has three behaviours that regularly cause bugs:

1. var is function-scoped, not block-scoped
   function example() {
   if (true) {
   var x = 10 // you'd expect this to stay in the if block
   }
   console.log(x) // 10 — var leaked out of the block
   }

// With let:
function example2() {
if (true) {
let x = 10
}
console.log(x) // ReferenceError — stayed in the block ✓
} 2. var is hoisted and initialized to undefined
console.log(name) // undefined — not an error
var name = 'Alice'
console.log(name) // 'Alice'

// The engine sees this:
var name = undefined // hoisted
console.log(name) // undefined
name = 'Alice' // assignment stays in place
console.log(name) // 'Alice' 3. var can be re-declared in the same scope
var user = 'Alice'
var user = 'Bob' // no error — silently overwrites
console.log(user) // 'Bob'

// let throws:
let score = 10
let score = 20 // SyntaxError: Identifier 'score' has already been declared
let — the modern variable
let fixes all three var problems:

Block-scoped — stays in the { } it was declared in
Hoisted but NOT initialized — accessing before declaration throws ReferenceError (Temporal Dead Zone)
Cannot be re-declared in the same scope
for (let i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 100)
}
// Prints: 0, 1, 2 — each iteration has its own i

for (var i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 100)
}
// Prints: 3, 3, 3 — all share the same i
This is the most important practical difference. let creates a fresh binding on every loop iteration. var has one binding shared across all iterations.

const — the immutable binding
const creates a binding that cannot be reassigned. Same scoping and TDZ as let.

const PI = 3.14159
PI = 3 // TypeError: Assignment to constant variable

const name = 'Alice'
name = 'Bob' // TypeError
Critical nuance: const does NOT make objects immutable.

const user = { name: 'Alice', age: 30 }
user.name = 'Bob' // ✓ — modifying a property is allowed
user.age = 31 // ✓ — still fine
user = { name: 'Charlie' } // ✗ TypeError — can't reassign the binding

const arr = [1, 2, 3]
arr.push(4) // ✓ — allowed, arr is still [1,2,3,4]
arr = [5, 6] // ✗ TypeError — can't reassign
const says "this binding will always point to this object." It says nothing about what's inside the object. To make an object truly immutable, use Object.freeze().

The Temporal Dead Zone (TDZ)
Both let and const are hoisted but not initialized. The gap between the start of their scope and their declaration line is the TDZ. Accessing in the TDZ throws ReferenceError.

function example() {
// TDZ for 'value' starts here
console.log(value) // ReferenceError: Cannot access 'value' before initialization
let value = 42 // TDZ ends here
console.log(value) // 42
}
The TDZ exists by design — it catches the class of bugs that var's silent undefined was hiding.

When to use each — the practical rule
Use When
const Default. Use for everything that doesn't need to be reassigned.
let When you know the value will change: loop counters, accumulated values, conditionally set variables.
var Almost never in modern code. Only when intentionally targeting pre-ES6 environments without a transpiler.
Common patterns
// const for objects and arrays — you'll mutate contents, not rebind
const config = { debug: false, version: '2.0' }
const items = []
items.push('first') // fine — not reassigning items

// let for values that change
let count = 0
for (let i = 0; i < 10; i++) {
count += i
}

// const for functions (most common in modern JS)
const add = (a, b) => a + b
const fetchUser = async (id) => { /_ ... _/ }

// Destructuring — const is fine even though it "looks like" you're creating multiple
const { name, age } = user
const [first, ...rest] = array
var vs let in for loops — the deep reason
// With var — one variable, all closures share it
for (var i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 0)
}
// Output: 3, 3, 3

// With let — new binding created per iteration
for (let i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 0)
}
// Output: 0, 1, 2
Why does let in a loop create a new binding each iteration? The spec mandates it: for each iteration of a for loop with let, a new lexical environment is created and the loop variable is re-bound. Each closure captures a different i. This is not magic — it's the spec explicitly designed to fix the var loop bug.

Common Misconceptions
⚠️
Many devs think const makes objects immutable — but actually const only prevents reassignment of the binding (the variable label). You can still add, remove, or change properties on a const object or push items into a const array. Use Object.freeze() for true immutability.

⚠️
Many devs think let and const are not hoisted — but actually both are hoisted to the top of their block scope. The difference from var is that they're not initialized. Accessing them before their declaration line throws ReferenceError due to the Temporal Dead Zone.

⚠️
Many devs think var and let differ only in hoisting — but the more important difference is scope. var is function-scoped and ignores block boundaries. let is block-scoped and respects every pair of curly braces. This is the difference that causes the for-loop closure bug.

⚠️
Many devs think you should use let by default and const for "constants" — but actually the modern convention is the opposite: use const by default for everything, and only switch to let when you know you need to reassign. This makes code more predictable and signals intent to readers.

⚠️
Many devs think re-declaring a var is an error — but actually it silently succeeds. var x = 1; var x = 2 is perfectly valid JavaScript and the second declaration wins. This is one of the reasons var is avoided in modern code — the lack of errors enables hard-to-find bugs.

⚠️
Many devs think const and let in a for loop work identically — but actually there's a key difference: let creates a new binding per iteration (each loop body has its own fresh variable), while const in a standard for loop would throw a TypeError because the update expression (i++) tries to reassign. const works fine in for...of and for...in loops.

Where You'll See This in Real Code
→
ESLint's prefer-const rule is enabled by default in most major projects including the React codebase itself — it enforces using const wherever possible, and the React team adopted it because const-by-default makes data flow more explicit and reduces accidental mutation bugs.

→
The infamous for-var-setTimeout bug has appeared in production code at nearly every company that used pre-ES6 JavaScript — event listeners, API callbacks, and animation frames all suffered from this pattern, which is why migrating to let was one of the first things teams did when ES6 shipped.

→
Babel transpiles const and let to var for older browser targets — but it adds runtime checks and IIFE wrappers to emulate block scoping and TDZ behaviour, which is why transpiled code is larger than source code and why native let/const in modern browsers is faster than the transpiled version.

→
React hooks use const almost exclusively — useState, useEffect, useCallback, and useMemo are all typically assigned to const because the binding itself never changes within a render (even though the state value changes, a new const binding is created on the next render call).

→
TypeScript's readonly keyword for object properties is the type-system equivalent of what developers want from const on objects — it prevents property reassignment at compile time, solving the limitation that const can't protect object contents.

→
The Node.js module system used var internally until the codebase was modernized — the migration from var to let/const was one of the largest refactoring efforts in Node.js history and was primarily motivated by catching scope-related bugs that var had been silently hiding.

⚡
Interview Cheat Sheet
✦
var: function-scoped, hoisted as undefined, can be re-declared and reassigned
✦
let: block-scoped, TDZ, cannot be re-declared in same scope, can be reassigned
✦
const: block-scoped, TDZ, cannot be re-declared or reassigned — but object contents can change
✦
const obj.x = 1 is allowed; obj = {} is not — const locks the binding, not the value
✦
Prefer const by default; use let only when you need to reassign; avoid var in modern code
