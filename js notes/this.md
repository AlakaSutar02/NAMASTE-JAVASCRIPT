JavaScript "this" Keyword Interview Questions

The Mental Model
`this` is not a variable. It is not determined by where a function is written. It is determined entirely by how a function is called — the call site, not the definition site. That single sentence explains 95% of all `this` confusion. Think of `this` as an invisible extra argument that every regular function receives automatically at call time. You do not pass it explicitly — JavaScript fills it in based on how the function was invoked. The same function can receive a completely different `this` on every call. There are exactly four binding rules, applied in strict priority order: 1. **new binding** — called with `new`? `this` = the brand new object being constructed 2. **Explicit binding** — called with `call`, `apply`, or `bind`? `this` = whatever you passed 3. **Implicit binding** — called as a method on an object (`obj.method()`)? `this` = that object 4. **Default binding** — plain call with no context? `this` = global object (or `undefined` in strict mode) Arrow functions are outside this hierarchy entirely. They have no `this` of their own. They inherit `this` from the enclosing regular function's execution context — set at the time they were written, never changeable. One additional rule: `this` is dynamic (determined at call time) for regular functions. `this` is lexical (determined at write time) for arrow functions. This is the most important contrast in all of JavaScript's `this` mechanics.

The Explanation
How `this` is set — the spec mechanism
Under the hood, every function call is a [[Call]] operation that receives a thisArgument. The JavaScript engine fills this in based on the call site before the function body executes. The function has no influence over what this it receives — only the caller determines it.

This is why this is called dynamic binding: it is bound fresh on every invocation, based on who called the function and how.

function show() {
console.log(this)
}

// Same function — completely different 'this' based on call site
show() // undefined (strict) or global
show.call({ x: 1 }) // { x: 1 }
new show() // newly created {}
({ fn: show }).fn() // { fn: show }
Rule 1 — Default binding: plain call, no context
function whoAmI() {
console.log(this)
}

whoAmI() // window (browser, sloppy mode)
// global (Node, sloppy mode)
// undefined (strict mode OR ES module)
Global scope: this differs by environment

// Browser — non-module script
console.log(this === window) // true

// Node.js — at module top level (CommonJS)
console.log(this === module.exports) // true — NOT global
console.log(this === global) // false (surprise!)

// Node.js — inside a function (non-strict)
function fn() { console.log(this === global) } // true

// ES module (type="module" in browser, .mjs in Node)
console.log(this) // undefined — modules are always strict
The Node module-level this being module.exports (not global) surprises many senior developers. It is a common interview gotcha.

Rule 2 — Implicit binding: method call
const user = {
name: 'Alice',
greet() {
console.log(`I'm ${this.name}`) // this = user
}
}

user.greet() // "I'm Alice"
The key question: what is directly to the left of the call parentheses? That object becomes this.

// Chained property access — the LAST object before the call is 'this'
const a = {
b: {
c: {
name: 'deep',
show() { console.log(this.name) }
}
}
}

a.b.c.show() // 'deep' — 'c' is immediately left of the call
Implicit binding loss — the most common bug:

const user = {
name: 'Alice',
greet() { console.log(this.name) }
}

user.greet() // 'Alice' ✓ — method call
const fn = user.greet
fn() // undefined/TypeError ✗ — plain call, this = global/undefined

// The same extraction bug happens with callbacks:
setTimeout(user.greet, 1000) // 'undefined' — setTimeout calls greet as plain fn

// Destructuring also extracts:
const { greet } = user
greet() // 'undefined' — same problem
Extracting a method from an object strips its context. The function is the same; its this becomes whatever the call site provides.

Rule 3 — Explicit binding: call, apply, bind
function introduce(city, lang) {
console.log(`${this.name}, ${city}, ${lang}`)
}

const alice = { name: 'Alice' }

// call — this + args spread
introduce.call(alice, 'Mumbai', 'JavaScript') // 'Alice, Mumbai, JavaScript'

// apply — this + args array
introduce.apply(alice, ['Mumbai', 'JavaScript']) // 'Alice, Mumbai, JavaScript'

// bind — returns new function with 'this' permanently locked (hard binding)
const aliceIntro = introduce.bind(alice)
aliceIntro('Delhi', 'TypeScript') // 'Alice, Delhi, TypeScript'

// Can you override a bound function's 'this' with call?
aliceIntro.call({ name: 'Bob' }, 'Pune', 'React') // 'Alice, Pune, React'
// NO — bind creates a hard binding. call/apply CANNOT override it.
Hard binding: bind() creates a wrapped function that permanently enforces a specific this. Calling the bound function with call() or apply() passes arguments fine — but the this is ignored and the bound value is used. This is a deliberate design decision.

Double bind — who wins?

function show() { console.log(this.x) }

const bound1 = show.bind({ x: 1 })
const bound2 = bound1.bind({ x: 2 })

bound2() // 1 — NOT 2
// First bind wins. bind() creates a hard-bound function.
// Calling .bind() on an already-bound function does nothing to 'this'.
// The second { x: 2 } is completely ignored.
Rule 4 — new binding: constructor call
function Person(name, age) {
// Inside a new call, JavaScript does this automatically BEFORE your code runs:
// 1. Creates a fresh object: this = Object.create(Person.prototype)
// 2. Sets 'this' to that object
// 3. Executes function body
// 4. Returns 'this' (unless function explicitly returns a different object)

this.name = name // attached to the new object
this.age = age
}

const alice = new Person('Alice', 30)
console.log(alice.name) // 'Alice'

// What happens if the constructor explicitly returns an object?
function Tricky() {
this.x = 1
return { x: 99 } // returning a DIFFERENT object overrides 'this'
}
const t = new Tricky()
console.log(t.x) // 99 — returned object replaces 'this'

// Returning a primitive is IGNORED — 'this' is returned instead
function Fine() {
this.x = 1
return 42 // primitive: ignored
}
const f = new Fine()
console.log(f.x) // 1 — 'this' returned, 42 discarded
new vs bind — the only case new beats explicit binding
function Counter(start) {
this.count = start
}

const BoundCounter = Counter.bind({ count: 999 }) // explicit binding to { count: 999 }

// new overrides bind — 'this' becomes the fresh object, NOT { count: 999 }
const c = new BoundCounter(10)
console.log(c.count) // 10 — new wins! bind's 'this' is ignored.
// (But bind's pre-filled arguments still work:)
const BoundStart = Counter.bind(null, 100)
const c2 = new BoundStart()
console.log(c2.count) // 100 — partial application preserved
new overrides bind()'s this. This is the only case where new beats explicit binding. It makes bind() useful for partial application of constructor arguments — you can pre-fill args while still letting new create fresh instances.

The binding precedence — commit this to memory
Priority Rule Triggered by 'this' value
1 (highest) new binding new fn() Newly created object
2 Explicit binding fn.call(x) / fn.apply(x) / fn.bind(x)() The value x (cannot be overridden)
3 Implicit binding obj.fn() obj
4 (lowest) Default binding fn() global (sloppy) or undefined (strict)
N/A Arrow function Any call Lexical — from enclosing scope, immutable
Arrow functions — lexical this, permanently sealed
const obj = {
value: 42,
// Regular function — 'this' depends on call site
regular: function() { return this.value },
// Arrow function — 'this' locked to enclosing scope at WRITE TIME
arrow: () => this.value // 'this' here = whatever 'this' is at obj definition time
}

console.log(obj.regular()) // 42 ✓ — method call, this = obj
console.log(obj.arrow()) // undefined — 'this' is global/undefined (arrow captured outer this)

// Arrow function as object method is a COMMON MISTAKE
// The arrow closes over 'this' from the scope where the object literal is written
// If the object is at module/global scope, 'this' there is undefined/global — not the object
Arrow functions cannot be bound, called, or applied with a different this:

const arrow = () => this

// All of these silently ignore the provided 'this':
arrow.call({ x: 1 }) // outer 'this' — { x: 1 } is ignored
arrow.apply({ x: 1 }) // outer 'this' — ignored
arrow.bind({ x: 1 })() // outer 'this' — ignored

// new with arrow throws:
new arrow() // TypeError: arrow is not a constructor
The correct use of arrow functions with this:

const timer = {
seconds: 0,
start() { // regular method — called as timer.start(), this = timer
setInterval(() => { // arrow — inherits 'this' from start(), which is timer
this.seconds++ // this = timer ✓
console.log(this.seconds)
}, 1000)
}
}
timer.start() // 1, 2, 3 ...
'this' in class — static vs instance vs inherited
class Animal {
constructor(name) {
this.name = name // 'this' = new instance
}

speak() {
return `${this.name} makes a noise.` // 'this' = instance (if called as method)
}

static create(name) {
return new this(name) // 'this' in static = the CLASS ITSELF (or subclass)
}
}

class Dog extends Animal {
speak() {
return super.speak() + ' Woof!' // super.speak() calls Animal.speak with this = dog instance
}
}

const d = Dog.create('Rex') // Animal.create → new this(name) → new Dog('Rex') (polymorphic!)
console.log(d.speak()) // 'Rex makes a noise. Woof!'

// 'this' in static method = the class (not the instance)
class MyClass {
static who() { return this }
}
console.log(MyClass.who() === MyClass) // true
console.log(MyClass.who() === new MyClass()) // false — 'this' is the class, not an instance
Class methods are strict mode by default — extracting a class method and calling it as a plain function gives this = undefined, not this = global.

class Service {
name = 'MyService'
log() { console.log(this.name) }
}

const s = new Service()
s.log() // 'MyService' ✓

const fn = s.log
fn() // TypeError: Cannot read properties of undefined
// In class strict mode: this = undefined, not global
'this' with Array method thisArg — the hidden second parameter
// forEach, map, filter, find, findIndex, some, every all accept thisArg as second arg
const processor = {
multiplier: 3,
process(arr) {
return arr.map(function(n) {
return n \* this.multiplier // 'this' would normally be undefined/global in a callback
}, this) // ← second arg sets 'this' for the callback
}
}

console.log(processor.process([1, 2, 3])) // [3, 6, 9] ✓

// Without thisArg — the classic array callback bug:
const obj = {
factor: 2,
double(arr) {
return arr.map(function(n) {
return n _ this.factor // this = undefined (strict), TypeError!
})
}
}
// Fix: use arrow function (no own 'this', inherits from double)
double(arr) {
return arr.map(n => n _ this.factor) // arrow: this = obj ✓
}
'this' in getters and setters
const obj = {
\_name: 'Alice',
get name() {
return this.\_name // 'this' = obj when accessed as obj.name
},
set name(val) {
this.\_name = val.trim() // 'this' = obj when assigned as obj.name = '...'
}
}

obj.name = ' Bob '
console.log(obj.name) // 'Bob'

// BUT: destructuring a getter loses 'this'
const { name } = obj // this executes the getter — returns the current value
// name is now 'Bob' (a string), not a live getter
Indirect calls — the trickiest 'this' interview questions
These three patterns all look like method calls but are actually default/global binding:

const obj = {
name: 'Alice',
greet() { return this.name }
}

// 1. Grouped expression — looks like method call but is NOT
;(obj.greet)() // 'Alice' — identical to obj.greet(), grouping changes nothing

// 2. Comma operator — evaluates to the function, loses reference
;(0, obj.greet)() // undefined — this is a PLAIN CALL. The comma operator evaluates
// the expression, which returns the function without its base object.

// 3. Assignment expression — same as comma
let fn
;(fn = obj.greet)() // undefined — assignment evaluates to the function value,
// the object reference is lost. Plain call. this = global/undefined.

// 4. Logical operators — same pattern
;(false || obj.greet)() // undefined — logical OR evaluates to obj.greet (the fn),
// not the reference. Plain call.
;(true && obj.greet)() // undefined — same issue
This is one of the most asked senior-level this questions at Google and Atlassian. The key: any expression that evaluates to a function without preserving the base object reference becomes a plain call.

'this' in Promise .then callbacks
class ApiService {
constructor() { this.baseURL = 'https://api.example.com' }

fetchData() {
return fetch(this.baseURL) // 'this' = ApiService instance ✓ (called as method)
.then(function(res) {
console.log(this.baseURL) // undefined — 'this' inside .then callback is undefined (strict)
return res.json()
})
.then(res => { // arrow function — 'this' = outer ApiService instance ✓
console.log(this.baseURL) // 'https://api.example.com'
return res
})
}
}

// .then callbacks are always called as plain functions (in strict mode = undefined 'this')
// Arrow functions are the standard solution for .then callbacks
Mixin pattern and 'this'
// Mixins work because 'this' is dynamic — same function, different object
const Serializable = {
serialize() {
return JSON.stringify(this) // 'this' will be whatever calls it
}
}

const Validatable = {
validate() {
return this.name && this.age > 0 // 'this' will be whatever calls it
}
}

class User {
constructor(name, age) {
this.name = name
this.age = age
Object.assign(this, Serializable, Validatable) // copy methods onto instance
}
}

const u = new User('Alice', 30)
u.serialize() // '{"name":"Alice","age":30}' — 'this' = u ✓
u.validate() // true — 'this' = u ✓
Soft bind — filling the gap between default and hard binding
// Problem: bind() is too hard — you can't override it with implicit binding later
// Problem: no bind = lost context on plain calls

// Soft bind: like bind, but allows method call (implicit binding) to override
Function.prototype.softBind = function(defaultThis, ...boundArgs) {
const fn = this
return function(...args) {
// If 'this' is global/undefined (default binding) → use defaultThis
// If 'this' was set by implicit/explicit binding → use that this
const ctx = (!this || this === globalThis) ? defaultThis : this
return fn.apply(ctx, [...boundArgs, ...args])
}
}

function greet() { console.log(this.name) }
const softBound = greet.softBind({ name: 'default' })

softBound() // 'default' — default binding → use provided fallback
softBound.call({ name: 'Alice' }) // 'Alice' — explicit binding overrides softBind
const obj = { name: 'Bob', fn: softBound }
obj.fn() // 'Bob' — implicit binding overrides softBind
Soft bind is rarely used in production but frequently asked as a senior-level implementation question. It shows deep understanding of this binding semantics.

React 'this' patterns — the full picture
// Pattern 1: Constructor bind (verbose, but explicit)
class Button extends React.Component {
constructor(props) {
super(props)
this.handleClick = this.handleClick.bind(this) // 'this' locked to instance
}
handleClick() { console.log(this.props.label) }
render() { return <button onClick={this.handleClick}>...</button> }
}

// Pattern 2: Arrow class field (most common in modern React)
class Button extends React.Component {
handleClick = () => { // arrow: 'this' = instance at class field initialization
console.log(this.props.label)
}
render() { return <button onClick={this.handleClick}>...</button> }
}

// Pattern 3: Inline arrow in render (new function on every render — OK for simple cases)
class Button extends React.Component {
handleClick() { console.log(this.props.label) }
render() {
return <button onClick={() => this.handleClick()}>...</button>
// New arrow created every render — if passed to PureComponent child, causes re-render
}
}

// Why React needs this fix at all:
// When React calls onClick={this.handleClick}, it calls handleClick() as a plain function
// In strict mode (which React uses): this = undefined → TypeError
// The fix ensures 'this' is the component instance when the callback fires
Common Misconceptions
⚠️
Many developers think `this` is determined by where a function is defined — but `this` is determined entirely by the call site. The same function can have completely different `this` values on different calls. Definition location is irrelevant except for arrow functions, which capture `this` lexically at write time.

⚠️
Many developers think arrow functions are just shorthand syntax for regular functions — but the fundamental semantic difference is that arrow functions have no own `this`. Calling an arrow with `.call()`, `.apply()`, `.bind()`, or `new` does not change its `this`. Using `new` on an arrow throws a TypeError.

⚠️
Many developers think bind permanently changes the original function — but bind returns a brand new function. The original is completely unchanged. You can call bind multiple times on the original to create multiple independently bound functions. Calling bind on an already-bound function does nothing to `this` — the first bind wins.

⚠️
Many developers think double bind (fn.bind(a).bind(b)) lets the second bind win — but the first bind creates a hard-bound function that ignores all future `this` overrides. `fn.bind(a).bind(b)()` uses `a` as `this`, not `b`. The second bind is silently ignored.

⚠️
Many developers think `new` always beats `bind` — but `new` beats `bind` only for `this` assignment. Any pre-filled arguments from bind are preserved and combined with the new call's arguments. `this` comes from `new` (the fresh object), but bound arguments still apply.

⚠️
Many developers think `(obj.method)()` loses context because of the parentheses — but parentheses around a method reference do not change `this`. `(obj.method)()` is identical to `obj.method()` — both are method calls with `this = obj`. The indirect call pattern that loses context is `(0, obj.method)()`, where the comma operator evaluates the function without its base object.

⚠️
Many developers think arrow functions work well as object literal methods — but this is a common mistake. An arrow method in an object literal closes over `this` from the scope where the object was written (usually module scope or global scope — not the object itself). `const obj = { fn: () => this }` — `this` inside `fn` is never `obj`.

⚠️
Many developers think `this` in a class method is always the instance — but class methods use strict mode, so extracting a method and calling it as a plain function gives `this = undefined`, not `this = global`. This causes a TypeError rather than the silent `undefined` properties you'd see in sloppy mode.

⚠️
Many developers think the `thisArg` parameter to `Array.prototype.map`, `forEach`, `filter`, etc. is obscure — but it exists precisely to solve the `this` binding problem for array callbacks. Passing `this` as the second argument to `map` makes the callback receive the outer object as `this`, allowing regular functions (not arrows) to access object properties.

⚠️
Many developers think `this` in Node.js module top level is `global` — but at the CommonJS module top level, `this` equals `module.exports` (an empty object), not `global`. Inside a function at module level, `this` defaults to `global` in non-strict mode. In ES modules, `this` at top level is `undefined`.

Where You'll See This in Real Code
→
React class components required explicit `this` binding for nearly a decade — the shift from constructor `bind()` to arrow class fields (`handleClick = () => {}`) happened because arrow fields eliminate the cognitive overhead of binding while also preventing the performance issue of inline arrows (which create new functions on every render). Understanding why the fix works requires knowing that class fields with arrows close over `this` at class initialization time.

→
Vue 3's Composition API largely eliminates this concerns — the Options API (Vue 2) required careful attention to this binding, which is one reason the Composition API uses plain function calls and closures instead of relying on this for component data access.

→
The addEventListener and removeEventListener pattern requires understanding this — if you pass a bound function to addEventListener, you must save the reference to remove it later, because .bind() creates a new function each time. Developers who don't know this leak event listeners.

→
async class methods and this — inside an async method, this works correctly as long as the method is called on the object. But if the async method is passed as a callback or used with Promise.then(), this binding is lost just like any other method, a common source of production bugs in service classes.

→
Node.js EventEmitter callbacks lose this — emitter.on('event', this.handler) detaches the handler from its class instance. The Node.js docs explicitly recommend using arrow functions or binding for this reason, but developers new to the event pattern regularly hit this bug.

→
TypeScript's noImplicitThis compiler option catches this binding bugs at compile time — it requires you to annotate what this should be in function signatures, and throws an error if TypeScript can't determine the type of this. Enabling it surfaces a class of bugs that would otherwise only appear at runtime.

⚡
Interview Cheat Sheet
✦
`this` is dynamic for regular functions — determined at CALL TIME, not definition time
✦
`this` is lexical for arrow functions — determined at WRITE TIME, never changeable
✦
Priority: new > call/apply/bind > method call > default (plain call)
✦
Default binding: `this` = global (sloppy) or `undefined` (strict / class / module)
✦
Implicit binding: `obj.method()` → `this = obj`. Only the object DIRECTLY LEFT of `()` matters.
✦
Extracting a method (`const fn = obj.method`) and calling as plain function → `this` lost
✦
call(ctx, ...args): calls immediately, sets `this = ctx`, args spread
✦
apply(ctx, argsArr): calls immediately, sets `this = ctx`, args as array
✦
bind(ctx, ...args): returns NEW function with `this` permanently locked — cannot be overridden
✦
Double bind: `fn.bind(a).bind(b)()` → `a` wins. Second bind's `this` is silently ignored.
✦
`new` overrides `bind`'s `this` but preserves bind's pre-filled arguments
✦
Arrow in object literal: closes over outer scope `this`, NOT the object — common mistake
✦
Arrow class field: closes over instance `this` at class initialization — React standard pattern
✦
`(0, obj.method)()` or `(fn = obj.method)()`: indirect call → plain call → `this` = global/undefined
✦
`this` in `.then()` callback (regular function) = `undefined` in strict mode → use arrows
✦
`thisArg` as second argument to map/forEach/filter: sets `this` for the callback
✦
`this` in static methods = the class itself (not an instance)
✦
`this` in Node.js module top level = `module.exports`, not `global`
✦
`this` in ES module top level = `undefined`
✦
Class methods are always strict — extracted method call gives `this = undefined`, not global
💡
How to Answer in an Interview

1.  Open every `this` answer with the one-sentence rule: "`this` is determined by the call site, not the definition site — except for arrow functions, which capture `this` lexically." Then state the four priority rules. This structure immediately separates you from candidates who describe `this` vaguely as "the object that owns the function."
2.  The indirect call question — `(0, obj.method)()` — is the most differentiating senior-level trap. Prepare the explanation: the comma operator evaluates the right side, returning the function value without preserving its base object. The result is a plain call. If the interviewer asks this, they expect you to know the output is `undefined`/TypeError and explain exactly why.
3.  When asked to compare call vs apply vs bind, give a concrete use case for each: call for immediately borrowing a method with specific args, apply for passing an array as args to a variadic function (pre-spread syntax: `Math.max.apply(null, arr)`), bind for creating a permanently-bound callback to pass as an event handler. Naming the use case is stronger than just describing the syntax.
4.  The double-bind question (`fn.bind(a).bind(b)` — who wins?) is asked at Atlassian, CRED, and Google for senior roles. Answer: `a` wins always, because `bind()` creates a hard-bound function whose `this` cannot be overridden. The second `bind(b)` is silently ignored. Demonstrate this with the output.
5.  Arrow class fields vs constructor bind — know both and explain the trade-off: arrow fields create a new function object per instance (slight memory overhead), constructor bind also creates a new function per instance. Arrow fields are cleaner syntax. The real trade-off is: arrow fields cannot be overridden on the prototype; constructor bind can be. For React, arrow fields are standard.
6.  When `this` loss comes up, always describe the mechanism before the fix: "extracting a method from an object strips the object reference — the function still exists but its `this` is now determined by the new call site, which is a plain call, giving `undefined` in strict mode." Then give all three fixes: bind, arrow wrapper, arrow class field.
7.  Connect `this` to production bugs in the answer: "This is the most common bug I've seen in class-based service layers — passing `this.method` as a callback to an event emitter or setTimeout without binding. The service crashes with TypeError on the first event." Interviewers hiring at 30+LPA want to know you've seen this in real code.
