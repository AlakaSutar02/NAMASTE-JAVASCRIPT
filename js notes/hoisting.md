## Understanding Hoisting in JavaScript

When JavaScript runs a script, It scans the entire file, finds every variable and function declaration, and registers them in memory first. This is called creation phase. This pre-scan behavior is what we call **hoisting**.
That means declarations are registered, but values are not.

**`var` : ** the name is registered and set to undefined.
**`let` & `const` : ** the name is registered but left completely uninitialised (the Temporal Dead Zone).
**`function` : ** declarations, the entire body is registered and ready.

```javascript
// 1. Function Hoisting (Works perfectly)
greet(); // Logs: "Hello!"
function greet() {
  console.log("Hello!");
}

// 2. var Hoisting (Returns undefined)
console.log(myVar); // undefined
var myVar = "Value";

// 3. let/const Hoisting (Throws a ReferenceError due to the TDZ)
console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization
let myLet = "Value";
```

The Mental Model
Picture a stage director before a play starts. Before the curtain rises, they read the entire script and make a list of every actor and every prop. When the play actually begins, the director already knows every name — even before that actor walks on stage. JavaScript does the same thing before running your code. It scans the entire file, finds every variable and function declaration, and registers them in memory first. Then — and only then — does it start executing line by line. That pre-scan is hoisting. The critical nuance: declarations are registered, but values are not. For var, the name is registered and set to undefined. For let/const, the name is registered but left completely uninitialised (the Temporal Dead Zone). For function declarations, the entire body is registered and ready. This is why calling a function before its declaration works, but reading a var before its assignment gives undefined rather than the value you expect.

The Explanation
What hoisting actually is — two-phase execution
Hoisting is not a physical movement of code. JavaScript never rewrites your file. What actually happens is that the JavaScript engine processes your code in two distinct phases:

Creation phase (Compilation) — the engine scans your code and allocates memory for all declarations before a single line executes.
Execution phase — your code runs line by line, assigning values and calling functions.
The result behaves as if declarations were moved to the top. That mental model is useful, but the mechanism is memory allocation — not code movement.

Lexical Environment and where variables actually live
During the creation phase, each execution context creates a Lexical Environment — a structure that maps variable names to their values. Inside that Lexical Environment is an Environment Record, which is where the actual variable bindings are stored.

When an interviewer asks "where exactly are variables stored?", the correct answer is: in the Environment Record of the Lexical Environment belonging to the current execution context. This is what makes hoisting possible — the Environment Record is populated during the creation phase before any code runs.

var — hoisted and initialized to undefined
console.log(name) // undefined — not a ReferenceError
var name = 'Alice'
console.log(name) // 'Alice'
During the creation phase, name is registered in the Environment Record and set to undefined. The assignment name = 'Alice' is not hoisted — it runs in place during the execution phase.

What the engine effectively processes:

// Creation phase — var is hoisted and initialized to undefined
var name = undefined

// Execution phase — runs line by line
console.log(name) // undefined
name = 'Alice' // assignment runs here
console.log(name) // 'Alice'
typeof is safe — even with undeclared variables
console.log(typeof notDeclaredAtAll) // 'undefined' — not a ReferenceError
console.log(typeof varHoisted) // 'undefined'
var varHoisted = 42
typeof is the only operator that doesn't throw for undeclared variables. This makes it the safe way to check if a variable exists. Everything else — accessing the variable directly — throws a ReferenceError for undeclared names.

let and const — hoisted but NOT initialized (Temporal Dead Zone)
console.log(age) // ReferenceError: Cannot access 'age' before initialization
let age = 25
let and const ARE hoisted — the engine registers them in the Environment Record. But unlike var, they are placed in the Temporal Dead Zone (TDZ): registered but explicitly marked as uninitialised. Accessing any TDZ variable throws a ReferenceError.

// TDZ starts here for 'score'
console.log(score) // ReferenceError — in TDZ

const score = 100 // TDZ ends here — now accessible
console.log(score) // 100
The TDZ is not a gap in knowledge — it's a deliberate design decision. var's silent undefined masked real bugs for years in production code.

Function declarations — fully hoisted (both declaration AND body)
greet('Alice') // 'Hello, Alice' — works perfectly before the declaration

function greet(name) {
console.log(`Hello, ${name}`)
}
Function declarations are completely hoisted — the engine registers the full function body in the Environment Record during the creation phase. Calling them before their declaration in source is intentional: it lets you place main logic at the top and helper functions at the bottom.

Function expressions and arrow functions — NOT fully hoisted
greet('Alice') // TypeError: greet is not a function

var greet = function(name) {
console.log(`Hello, ${name}`)
}
Here greet is a var — it's hoisted and initialized to undefined. Calling undefined() as a function throws a TypeError. The function body stays where you wrote it.

// What the engine sees:
var greet = undefined // hoisted

greet('Alice') // TypeError: greet is not a function (it's undefined)

greet = function(name) { // assignment runs here
console.log(`Hello, ${name}`)
}
Arrow functions follow the same rules as their binding keyword (var → undefined + TypeError, const → TDZ + ReferenceError):

sayHi() // TypeError if var, ReferenceError if const/let

const sayHi = () => console.log('Hi')
Named function expressions — the name is local only
var calc = function multiply(a, b) {
return a \* b
}

console.log(calc(3, 4)) // 12
console.log(multiply(3, 4)) // ReferenceError: multiply is not defined
In a named function expression, the name (multiply) is only accessible inside the function body (for recursion). It is not hoisted to the outer scope. Only calc (the variable) is accessible outside — and only after the assignment runs.

Function declaration vs var — who wins? (Interview classic)
When a function declaration and a var share the same name, the engine processes them in this order during hoisting:

Function declarations are hoisted first and fully initialized
var declarations are then processed — but if the name already exists, the var declaration is silently ignored
Assignments (var foo = value) still run during the execution phase and overwrite whatever was there
function test() {
console.log(typeof foo) // 'function' — function wins during hoisting

var foo = 'bar' // var declaration ignored (foo already exists); assignment runs later

function foo() {
return 'I am a function'
}

console.log(typeof foo) // 'string' — assignment overwrote function
}

test()
🔥 Interview gold — the hardest hoisting trap
This is one of the most commonly asked tricky questions at top companies:

console.log(a) // What prints?
var a = 1
function a() {}
console.log(a) // What prints?
Output:

function a() {} // NOT undefined — function declaration wins hoisting
1 // assignment var a = 1 runs and overwrites the function
Step by step in the creation phase:

Function declaration function a() {} is hoisted first → a is the function
var a is processed — but a already exists, so the declaration is ignored
Execution starts: console.log(a) → prints the function
a = 1 runs → overwrites the function with 1
console.log(a) → prints 1
Most candidates say undefined for the first log. The correct answer is the function body.

Hoisting is per-scope — not just global
var x = 1

function example() {
console.log(x) // undefined — NOT 1
var x = 2
console.log(x) // 2
}

example()
The var x inside example is hoisted to the top of that function's scope — completely separate from the global x. The function creates a new Environment Record, and x is registered there as undefined. This shadows the global x for the entire function body.

Block-scoped functions — strict mode vs sloppy mode
if (true) {
function test() { return 'block' }
}

console.log(typeof test) // In sloppy mode: 'function' — hoisted to outer scope
// In strict mode: 'undefined' — block scoped
This is an edge case interviewers occasionally ask about. The behaviour differs between modes:

Sloppy mode: functions declared inside blocks are hoisted to the enclosing function/global scope (legacy behaviour)
Strict mode ('use strict' or ES modules): functions declared inside blocks are block-scoped — they don't leak out
In modern JavaScript (ES modules are always strict), a function declared inside an if block is not accessible outside it.

Import statements — module instantiation, not hoisting
// This works:
console.log(add(2, 3)) // 5
import { add } from './math.js'
ES module imports appear to be hoisted, but the mechanism is different from variable or function hoisting. Imports are processed during module instantiation — a separate phase that runs before any module code executes. The entire dependency graph is resolved and linked before execution begins. This is not the same as "hoisted like a function declaration." Safer phrasing: imports are resolved during module instantiation, before any code runs.

Class declarations — hoisted but in TDZ (same as let/const)
const p = new Person('Alice') // ReferenceError: Cannot access 'Person' before initialization
class Person {
constructor(name) { this.name = name }
}
Class declarations are hoisted but remain in the TDZ. You cannot use a class before its declaration. This is consistent with let/const semantics.

Class expressions follow their binding keyword:

// var class expression
var Animal = class {} // var is undefined until assignment
// const class expression
const Animal = class {} // TDZ until assignment line
The complete hoisting reference table
Declaration Hoisted? Initialized to Accessing before declaration
var x ✓ Yes undefined undefined
let x ✓ Yes TDZ (uninitialised) ReferenceError
const x ✓ Yes TDZ (uninitialised) ReferenceError
function f(){} ✓ Yes Full function body Works ✓
var f = function(){} ✓ Yes (var only) undefined TypeError
const f = () => {} ✓ Yes (const only) TDZ ReferenceError
class C {} ✓ Yes TDZ ReferenceError
var C = class {} ✓ Yes (var only) undefined TypeError
import { x } Module instantiation Fully resolved Works ✓
Hoisting priority — the four rules in order
Function declarations are hoisted first — highest priority, fully initialized
var declarations are processed next — if name already exists (from a function declaration), the var declaration is silently ignored
Assignments (var x = value) are NOT hoisted — they run during the execution phase in order
let/const/class are hoisted into TDZ — registered but inaccessible until their line
When in doubt: ask yourself "what phase is this?". Creation phase = declarations only. Execution phase = assignments, calls, everything else.

Common Misconceptions
⚠️
Many developers think hoisting physically moves code to the top of the file — but JavaScript never rewrites your code. Hoisting is a result of two-phase execution: during the creation phase, declarations are registered in the Lexical Environment's Environment Record before any code runs. Nothing is relocated.

⚠️
Many developers think let and const are not hoisted — but they are hoisted, just not initialized. They exist in the Temporal Dead Zone from the start of their scope until their declaration line. The ReferenceError you get accessing them early is proof the engine knows they exist — it's deliberately preventing access.

⚠️
Many developers treat undefined from a var and ReferenceError from let/const as the same thing — but they mean very different things. undefined means the variable exists but hasn't been assigned yet. ReferenceError means the variable is in TDZ — it exists in memory but is intentionally inaccessible.

⚠️
Many developers think function expressions are fully hoisted like function declarations — but only the variable name is hoisted (to undefined for var). The function body stays where you wrote it. Calling a function expression before its assignment gives TypeError, not "works fine".

⚠️
Many developers think hoisting only applies to the top of the file — but hoisting happens at the top of every scope. A var inside a function hoists to the top of that function's scope (a new Environment Record), not the global scope. This is why var inside a function doesn't shadow the outer scope from the outer scope's perspective.

⚠️
Many developers think you can use a class before its declaration because "everything is hoisted" — but class declarations are in the TDZ just like let and const. The "everything is hoisted" intuition only applies fully to function declarations.

⚠️
Many developers think typeof always throws for undeclared variables — but typeof is the one safe exception. typeof undeclaredVariable returns 'undefined' without throwing. This makes typeof the correct way to check for optional globals or polyfills.

⚠️
Many developers think the var declaration in "var foo; function foo(){}" means the var wins — but the function declaration is processed first and foo becomes the function. The var declaration is then silently ignored because foo already exists. The var assignment (if any) still runs and can overwrite it.

Where You'll See This in Real Code
→
ESLint's no-use-before-define rule exists entirely because of hoisting confusion. It enforces declaring variables before using them, preventing the silent undefined bugs that var hoisting causes in production code where developers rely on reading a variable before its assignment.

→
The Temporal Dead Zone for let and const was specifically designed to catch real bugs. Before ES6, var's silent undefined was masking errors in production — developers accessed variables before assignment and got undefined instead of a crash, making bugs extremely hard to trace.

→
React hooks rely on declaration order within a component render. React's rules-of-hooks linter enforces that hooks are always called in the same order precisely because the internal state is indexed positionally — the same principle as JavaScript's scope-based hoisting: order and scope matter.

→
Module bundlers like Webpack and esbuild use a form of static hoisting — they analyse import and export declarations before processing module bodies. This is why you cannot conditionally import in ES modules: the static analysis phase requires all imports to be known upfront, mirroring how JavaScript's own module instantiation works.

→
TypeScript enforces the TDZ at compile time. It reports an error if you access a let or const variable before its declaration in source order, essentially making a runtime ReferenceError into a compile-time error. This is the same protection the TDZ provides, shifted earlier.

→
Polyfill detection patterns like if (typeof Promise !== 'undefined') rely on typeof's special safe behaviour with undeclared variables. Without typeof's exception to the ReferenceError rule, checking for native APIs that might not exist would always require try-catch.

→
Legacy codebases often have bugs where developers wrote var inside if-blocks expecting block scope — they got function scope instead. This is one of the most common var hoisting bugs in the wild, and why let was introduced to give JavaScript actual block scoping.

⚡Interview Cheat Sheet
✦
var → hoisted + initialized to undefined → accessing before declaration gives undefined, not an error
✦
let/const → hoisted + TDZ → accessing before declaration throws ReferenceError
✦
function declaration → fully hoisted (declaration + body) → callable before it appears in source
✦
function expression (var f = function(){}) → only var is hoisted → calling before assignment throws TypeError
✦
arrow function (const f = () => {}) → const is hoisted to TDZ → accessing before declaration throws ReferenceError
✦
Function declarations are processed before var declarations — function wins when names collide
✦
var declarations are silently ignored if the name already exists from a function declaration
✦
Assignments are never hoisted — they always run in place during the execution phase
✦
Hoisting happens per-scope, not globally — var inside a function hoists to that function's Environment Record
✦
class declarations → hoisted + TDZ → same behaviour as let/const, not function declarations
✦
typeof is the one safe operator for undeclared variables — returns 'undefined' instead of throwing ReferenceError
✦
Block-scoped functions in sloppy mode leak to outer scope; in strict mode / ES modules they don't

💡How to Answer in an Interview

1. Draw the two-phase model when explaining hoisting — "creation phase registers declarations, execution phase runs assignments". This is more precise than saying "moved to the top" and immediately shows interviewers you understand the mechanism, not just the symptom.

2. When asked about let/const hoisting, always bring up the Temporal Dead Zone and Lexical Environment terminology. Saying "let is hoisted into the TDZ inside the Environment Record of the execution context" versus "let is not hoisted" is the difference between a mid-level and senior-level answer.

3. The function-declaration-vs-var-same-name collision is asked at Google, Flipkart, Razorpay, and Atlassian. Prepare the console.log(a); var a=1; function a(){} example cold — be able to explain all four steps: function hoisted first, var declaration ignored, first log prints function, assignment runs and overwrites.

4. When asked about typeof, mention that it's the only operator that doesn't throw for undeclared variables. This comes up in security-conscious companies (Razorpay, PhonePe) who ask about safe global checks.

5. Connect hoisting to real bugs you've seen: "This is exactly why legacy var code had silent undefined bugs — the variable was declared but not yet assigned when it was first read." Showing you've encountered this in practice signals production experience.

6. Block-scoped function declarations in strict mode vs sloppy mode is a bonus point. Most candidates don't know this. Mentioning it proactively — without being asked — distinguishes you as someone who reads specs, not just tutorials.

7. When discussing imports, use the phrase "module instantiation phase" rather than "hoisted". Imports are resolved before any module code runs, but through a different mechanism than variable hoisting. Interviewers who know the spec will respect the precision.
