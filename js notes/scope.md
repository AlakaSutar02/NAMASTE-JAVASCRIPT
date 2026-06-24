JavaScript Scope Interview Questions
Scope determines where variables are accessible. Master global, function, block scope and the scope chain for JavaScript interviews.

The Mental Model
Picture a set of nested rooms in a house. Each room has its own cabinet of variables. When you need something, you check your own cabinet first. Not there? Walk to the next outer room and check. Keep walking outward until you find it or exit the house entirely and get a ReferenceError. That walk outward is the scope chain. The innermost room is your current function. Each outer room is an enclosing function. The house itself is the global scope. Two critical rules: you can always look outward, never inward. A parent room cannot see inside a child room. And scope is determined by where you write the function — not where you call it. The room a function lives in is decided at the moment you type it, locked in forever. This is called lexical scoping. There is a third scope type beyond global and function: block scope. Variables declared with let and const only exist within the { } braces they were declared in. var ignores braces entirely — it only respects function boundaries. This one difference causes more bugs than almost anything else in JavaScript.

The Explanation
How scope is created — Execution Context and Lexical Environments
Scope is not magic. It is created by the JavaScript engine in a predictable, mechanical way:

Every time JavaScript runs a piece of code (global code, a function call, an eval), it creates an Execution Context.
Each Execution Context contains a Lexical Environment — a data structure that stores the variable bindings for that context.
Each Lexical Environment has an Environment Record (the actual key-value store of variable names and values) and a pointer called outer that references the Lexical Environment of the enclosing scope.
The scope chain is literally a linked list of Lexical Environments, connected by those outer pointers. Looking up a variable means walking that linked list outward until you find the binding or hit null (global scope has no outer).

function outer() {
const x = 'outer' // stored in outer's Environment Record
function inner() {
const y = 'inner' // stored in inner's Environment Record
console.log(x) // x not found in inner → follow outer pointer → found in outer's record
}
inner()
}
The five types of scope

1. Global scope
   Variables declared outside any function or block. The global scope differs by environment:

// Browser: top-level var becomes a property of window
var appName = 'JSPrep'
console.log(window.appName) // 'JSPrep'

// let/const do NOT become window properties even at global scope
let version = '2.0'
console.log(window.version) // undefined

// Node.js: global object, not window
// global.something = 'value'

// Universal: globalThis — works in browser, Node, and Web Workers
console.log(globalThis === window) // true in browser
console.log(globalThis === global) // true in Node.js
ES modules change global scope: top-level variables in a type="module" file are module-scoped, not global. They do not attach to window. This is why modules don't pollute the global namespace.

2. Function scope
   Variables declared inside a function exist only within that function. Both var, let, and const respect function boundaries.

function makeGreeting() {
var msg = 'Hello' // function-scoped
let name = 'Alice' // function-scoped
const punc = '!' // function-scoped
console.log(msg + ', ' + name + punc) // 'Hello, Alice!'
}

makeGreeting()
console.log(msg) // ReferenceError — all three are gone 3. Block scope
let and const are scoped to the nearest enclosing { } block. var ignores all blocks except function boundaries.

if (true) {
var funcScoped = 'leaks out' // var ignores the if-block
let blockScoped = 'stays in' // let respects the block
const alsoBlock = 'stays in' // const respects the block
}

console.log(funcScoped) // 'leaks out' — var crossed the block
console.log(blockScoped) // ReferenceError
console.log(alsoBlock) // ReferenceError 4. Module scope
Every ES module (import/export) has its own scope. Top-level declarations are module-private unless explicitly exported.

// math.js
const PI = 3.14159 // module-private — cannot be accessed from outside
export function area(r) { // exported — accessible to importers
return PI _ r _ r // PI is visible inside the module
}

// main.js
import { area } from './math.js'
console.log(area(5)) // 78.53975 ✓
console.log(PI) // ReferenceError — PI was never exported 5. Eval scope (know it, avoid it)
eval() executes a string as code in the current scope. In non-strict mode, it can introduce new variable bindings into the current scope at runtime — making static analysis impossible.

function dangerous() {
eval('var surprise = 42') // injects 'surprise' into function scope at runtime
console.log(surprise) // 42 — appeared from nowhere
}

// In strict mode, eval gets its own scope and cannot inject bindings
'use strict'
function safe() {
eval('var surprise = 42')
console.log(typeof surprise) // 'undefined' — eval's var stayed in eval's scope
}
Never use eval in production. It disables engine optimisations, creates security vulnerabilities (XSS), and makes scope unpredictable. Asked in interviews to test scope depth knowledge, not as a recommendation.

Lexical scope vs dynamic scope — the fundamental design choice
JavaScript uses lexical scope (also called static scope): scope is determined by where a function is written in the source code. This decision is made at parse time and never changes at runtime.

const x = 'global'

function readX() {
console.log(x) // always reads from where readX was DEFINED
}

function other() {
const x = 'local x'
readX() // LEXICAL: prints 'global', ignores 'local x' in other()
}

other() // 'global'
Dynamic scope would work the opposite way: scope is determined by where a function is called from. In a dynamically scoped language, readX() called inside other() would see other()'s x = 'local x'. JavaScript does not work this way — but this does (it is the one dynamically-scoped thing in JavaScript, bound at call time, not definition time).

The with statement was JavaScript's attempt at dynamic scope-like behaviour. It adds an object's properties to the scope chain, making with (obj) { x } look up x in obj first. It's banned in strict mode, obsolete, and a scope chain nightmare — but you may be asked about it:

const obj = { x: 42 }
with (obj) {
console.log(x) // 42 — obj's properties injected into scope chain
}
// Strict mode: SyntaxError — with is forbidden
Variable shadowing — same name, different variable
let score = 100

function game() {
let score = 50 // completely new variable — shadows outer 'score'
console.log(score) // 50 — reads the inner one
}

game()
console.log(score) // 100 — outer is untouched
Shadowing creates an entirely separate variable that shares a name. The outer variable continues to exist — it is simply unreachable from within the inner scope for the duration of that scope. The most dangerous shadowing bug: you intend to modify an outer variable, but accidentally declare a new inner one with the same name. Use ESLint's no-shadow rule.

// Dangerous shadow bug
let count = 0

function increment() {
let count = count + 1 // ReferenceError: 'count' accessed before initialization
// The let creates a new 'count' in TDZ — the right side reads the TDZ 'count', not the outer one
}
The var-in-loop closure trap — the most asked scope interview question
// Classic bug — what does this print?
for (var i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 0)
}
// Prints: 3, 3, 3 (NOT 0, 1, 2)
Why: var is function-scoped (or global here). All three setTimeout callbacks share the same i variable — there is only one i in the scope, not three. By the time the callbacks run (after the loop ends), i is already 3.

Fix 1 — use let:

for (let i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 0)
}
// Prints: 0, 1, 2
let creates a new binding per iteration. The JavaScript engine creates a new Lexical Environment for each loop iteration, copies the current value of i into it, and the callback captures that iteration's specific i. This is a spec-level guarantee for let in for loops.

Fix 2 — IIFE (pre-ES6 solution):

for (var i = 0; i < 3; i++) {
(function(capturedI) {
setTimeout(() => console.log(capturedI), 0)
})(i)
}
// Prints: 0, 1, 2
The IIFE creates a new function scope per iteration, and capturedI is a new binding each time. Each callback closes over its own capturedI.

Fix 3 — bind:

for (var i = 0; i < 3; i++) {
setTimeout(console.log.bind(null, i), 0)
}
let/const in every type of for loop
// for — new binding per iteration ✓
for (let i = 0; i < 3; i++) { /_ i is fresh each iteration _/ }

// for...of — new binding per iteration ✓
const arr = ['a', 'b', 'c']
for (let item of arr) { /_ item is a new binding each iteration _/ }

// for...in — new binding per iteration ✓
const obj = { x: 1, y: 2 }
for (let key in obj) { /_ key is a new binding each iteration _/ }

// But: the initializer of for(let i...) is in an OUTER block scope
// The body of for gets a COPY of i, which is updated each iteration
// This means: mutations to i inside the body are propagated back — engine handles this
Block scope in switch — the invisible bug
switch (action) {
case 'increment':
let count = state.count + 1 // let is scoped to the SWITCH BLOCK, not this case
break
case 'decrement':
let count = state.count - 1 // SyntaxError: Identifier 'count' has already been declared
break
}
The entire switch statement is one block. All let/const declarations inside it share the same scope — even across different case branches. The fix: wrap each case in its own block:

switch (action) {
case 'increment': { // explicit block — creates its own scope
let count = state.count + 1
break
}
case 'decrement': { // separate block — no conflict
let count = state.count - 1
break
}
}
catch block scope — the exception to the rule
try {
throw new Error('oops')
} catch (err) {
console.log(err.message) // 'oops' — err is scoped to catch block
}

console.log(err) // ReferenceError — err does not exist outside catch

// But: var inside catch leaks (var ignores catch block boundaries)
try {
// ...
} catch (e) {
var leaked = 'I escaped'
}
console.log(leaked) // 'I escaped' — var leaked out of catch
The catch binding (err, e, etc.) is always block-scoped to the catch clause, even in pre-ES6 environments. This was one of the first block-scoped bindings in JavaScript.

Default parameter scope — the hidden extra scope
This is one of the most obscure scope questions interviewers ask at senior level:

// Default parameters have their OWN scope — separate from the function body
function outer(a, b = () => a) { // parameters create a scope
let a = 'inner' // body creates a different scope
console.log(b()) // What does b() see?
}

outer('outer') // 'outer' — b() captures parameter 'a', not body's 'a'
When a function has default parameters, JavaScript creates two scopes:

A parameter scope containing the parameter bindings
A body scope nested inside it for the function body
Default parameters are evaluated in the parameter scope, not the body scope. Redeclaring a parameter name with let/const inside the body creates a new binding in the body scope, shadowing the parameter. Default parameter expressions can reference earlier parameters:

function greet(name, greeting = `Hello, ${name}`) {
console.log(greeting)
}
greet('Alice') // 'Hello, Alice' — greeting default references name
The arguments object and scope
function regular() {
console.log(arguments[0]) // works — arguments is in function scope
}

const arrow = () => {
console.log(arguments) // ReferenceError (or outer arguments if in a function)
}

// Arrow functions do not have their own 'arguments' object
// They inherit 'arguments' from the nearest enclosing regular function
arguments is a function-scoped object in regular functions only. Arrow functions don't have it. This matters for variadic functions — use rest parameters (...args) instead of arguments in modern code.

Implicit globals — the worst scope bug
function setName() {
name = 'Alice' // No var/let/const — NOT a local variable
}

setName()
console.log(name) // 'Alice' — accidentally created a global!
In non-strict mode, assigning to an undeclared variable creates a property on the global object. This is one of the most dangerous bugs because it's silent and produces hard-to-trace cross-function contamination. Strict mode converts this into a ReferenceError:

'use strict'
function setName() {
name = 'Alice' // ReferenceError: name is not defined
}
IIFE — scope isolation before modules
// Named IIFE — the name is only visible INSIDE the IIFE
(function myModule() {
console.log(myModule) // ƒ myModule() — visible inside
})()

console.log(myModule) // ReferenceError — not visible outside
IIFEs were the primary pattern for scope isolation before ES modules. The function creates a new scope; anything declared inside stays private. Named IIFEs allow self-reference for recursion, but the name is local to the IIFE only.

Scope chain lookup cost
Each variable lookup walks the scope chain from the current Environment Record outward. Variables in the current scope are found immediately. Variables from outer scopes require traversing more links. In tight loops, this matters:

// Slower — looks up 'document' through scope chain on every iteration
for (let i = 0; i < 10000; i++) {
document.getElementById('box').style.left = i + 'px' // scope chain lookup + DOM access
}

// Faster — cache the reference in local scope
const box = document.getElementById('box') // one lookup
for (let i = 0; i < 10000; i++) {
box.style.left = i + 'px' // local variable, found immediately
}
Modern V8 optimises most of this, but the pattern of caching global/outer references in local variables is still a best practice in performance-critical code.

Scope vs closure — the key distinction
These terms are often confused. They are related but distinct:

Scope is a static structure — it describes which variables are accessible where in the source code. It is determined at parse time and doesn't change.
Closure is a runtime phenomenon — it is what happens when a function is executed and retains access to its outer scope's variables even after that outer scope has returned.
function outer() {
let x = 10 // x is in outer's scope (static structure)
return function inner() {
console.log(x) // inner closes over outer's scope at RUNTIME (closure)
}
}

const fn = outer() // outer's scope is "gone" — but the closure keeps x alive
fn() // 10 — this is closure in action
Every function in JavaScript is technically a closure — it closes over the scope in which it was defined. But we typically only call it a "closure" when the function outlives its outer scope — when it's returned, stored, or passed as a callback.

The four scope rules — memorise this order for interviews
Lexical: scope is determined by where the function is written, not called
Nested: inner scopes can access outer scopes; outer cannot access inner
Shadowing: inner declarations with the same name hide (shadow) outer ones
var vs let/const: var respects function boundaries; let/const respect block boundaries
Common Misconceptions
⚠️
Many developers think scope is determined by where a function is called — but JavaScript uses lexical scoping: scope is fixed at the point where the function is written in the source. Calling it from a different context, passing it as a callback, or returning it from another function does not change what variables it can access.

⚠️
Many developers think var is block-scoped like let and const — but var ignores all block boundaries except function boundaries. A var declared inside an if block, a for loop, or a switch case leaks into the enclosing function. This exact bug has shipped to production at major companies, which is why ESLint's no-var rule exists.

⚠️
Many developers think let and const are not hoisted — but they are hoisted into the Temporal Dead Zone. They exist in the Environment Record from the start of their scope, they're just inaccessible until their declaration line. The ReferenceError you get before the declaration is proof the engine knows they exist.

⚠️
Many developers think all iterations of a for loop share the same binding — but for loops with let create a new binding per iteration. Each iteration's callback closes over a completely separate variable, which is exactly why let fixes the var-in-setTimeout bug.

⚠️
Many developers think all iterations of a for loop share the same binding — but for loops with let create a new binding per iteration. Each iteration's callback closes over a completely separate variable, which is exactly why let fixes the var-in-setTimeout bug.

⚠️
Many developers think shadowing modifies the outer variable — but shadowing creates an entirely separate variable. The outer variable continues to exist unchanged. Changing the inner shadowed variable has zero effect on the outer one. They share a name and nothing else.

⚠️
Many developers think top-level code in a module file is global — but ES modules have their own scope. Top-level variables are module-private. Only explicitly exported values cross the module boundary. This is fundamentally different from classic script files where top-level var creates window properties.

⚠️
Many developers think arrow functions have their own arguments object — but arrow functions have no arguments, no this, no super, and no new.target of their own. They inherit arguments from the nearest enclosing regular function's scope. Using arguments in an arrow function gives you the outer function's arguments or a ReferenceError.

⚠️
Many developers think strict mode changes what variables are accessible — but strict mode does not change scope rules. It changes what happens when you assign to an undeclared variable: in non-strict mode, it silently creates a global; in strict mode, it throws a ReferenceError. Scope structure is the same in both modes.

⚠️
Many developers think the switch statement creates a new scope per case — but the entire switch is one block. let and const declared in one case are visible in all cases within the same switch. This causes SyntaxError if two cases declare the same name. Wrap each case in { } to give it its own block scope.

Where You'll See This in Real Code
→
The infamous var-in-for-loop bug with event listeners caused incorrect behaviour in classic jQuery code when developers attached click handlers in loops — all handlers captured the final loop value instead of the per-iteration value. The entire ecosystem shifted to let and IIFE patterns to fix this class of bug.

→
React's useState and useRef hooks create closure-based state isolated to each component instance. Each render call is a function invocation with its own scope. This is why two instances of the same component have independent state — they each closed over their own execution context.

→
Redux reducers use block scope in switch statements with explicit { } braces around each case — this is why Redux's official documentation and templates always show braces around case bodies. Without them, let declarations in different cases would conflict in the shared switch scope.

→
Node.js modules wrapped every CommonJS module in a function wrapper: (function(exports, require, module, **filename, **dirname) { /_ your module code _/ }). This is why \_\_dirname and module are available inside Node files — they're injected as function parameters, creating module-level scope without polluting the global object.

→
Webpack's scope hoisting (ModuleConcatenationPlugin) analyses the scope chain across the entire module graph and merges module scopes where safe — effectively inlining small modules into the calling scope, eliminating function wrapper overhead. This can reduce bundle size by 5–15% and improve parse speed.

→
JavaScript security libraries use IIFEs with strict mode to create completely isolated scopes for sensitive operations. Payment SDKs (like Stripe.js) wrap their entire codebase in a strict-mode IIFE so that: no external code can inject into their scope, no internal bugs create implicit globals, and the internal API surface is explicitly controlled.

→
ESLint's no-shadow rule is enabled in virtually every production codebase at companies like Airbnb, Google, and Facebook because shadowing bugs are some of the hardest to debug — the code looks correct (both variables exist and have valid values), but the wrong one is being read or written.

→
TypeScript's strict null checks leverage scope analysis to track variable refinement — when you write if (value !== null) { use(value) }, TypeScript knows that inside the block, value's type has been narrowed. This is direct application of block scope semantics to type checking.

⚡
Interview Cheat Sheet
✦
var → function-scoped → ignores if/for/while/switch blocks, leaks to enclosing function
✦
let/const → block-scoped → respects { } boundaries, does not leak
✦
Scope is lexical (static) — determined where you WRITE the function, not where you CALL it
✦
The scope chain is a linked list of Lexical Environments connected by outer references
✦
Variable lookup walks outward through the chain — never inward
✦
for(let i...) creates a new 'i' binding per iteration — each callback gets its own i
✦
for(var i...) shares one 'i' across all iterations — the classic setTimeout bug
✦
switch is one block — let/const declared in different cases conflict. Use { } around cases
✦
catch(e) — the catch identifier is always block-scoped to catch, even pre-ES6
✦
Default parameters get their own scope, separate from the function body
✦
Arrow functions have no arguments object — they inherit from the outer regular function
✦
Implicit globals: assigning to undeclared variable creates global in sloppy mode, throws in strict
✦
typeof on undeclared variable → 'undefined' (safe). Directly accessing undeclared → ReferenceError
✦
globalThis — unified global object reference across browser, Node, and Web Workers
✦
Module top-level is NOT global — let/const/var at module top level are module-private
✦
Scope is static structure. Closure is when a function retains access after its outer scope returns.
✦
with statement → injects object properties into scope chain → banned in strict mode
✦
eval() can inject bindings in non-strict mode → disabled in strict mode, never use in production
💡
How to Answer in an Interview

1.  When asked "what is scope", give the two-sentence precise answer first — "Scope determines which variables are accessible where. JavaScript uses lexical scope: scope is determined by where a function is written, not where it's called." Then offer to go deeper into any aspect.
2.  When asked about the var-in-loop setTimeout problem, explain all three layers: why it happens (var is function-scoped, one binding shared), why let fixes it (new binding per iteration, spec-guaranteed), and the pre-ES6 fix (IIFE per iteration). Knowing all three separates senior candidates from mid-level.
3.  Mention Lexical Environments and Environment Records when discussing how scope is implemented. Saying "JavaScript creates a Lexical Environment for each execution context, with an outer reference that forms the scope chain" immediately signals that you understand the engine, not just the behaviour.
4.  The switch statement scope leak (let declarations shared across cases) is a question that trips up 80% of candidates because it's counterintuitive. Prepare an example where two case branches declare the same let variable name and explain the SyntaxError — and the { } fix.
5.  When asked about closure vs scope, give the sharp distinction: scope is a static structure defined at parse time, closure is what happens at runtime when a function outlives the scope it was defined in. Most candidates conflate the two — distinguishing them is a strong signal.
6.  The default parameter scope question (parameters have their own scope separate from the function body) is asked at Google and Atlassian for senior roles. Prepare the example where a default parameter callback captures the parameter binding, not the body's let redeclaration.
7.  When discussing module scope, mention globalThis — the fact that ES modules don't create window properties even for top-level var is important for companies building large-scale SPAs (Flipkart, Razorpay). Global namespace pollution through script files vs module isolation is a practical architecture concern.
8.  Connect scope to performance in optimization discussions: local variable lookups are O(1) in the current Environment Record, outer variable lookups require traversing the scope chain. Caching frequently used outer references in local variables is a classic V8 optimization pattern.
