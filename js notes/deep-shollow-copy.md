The Mental Model
Picture a real estate agent making a copy of a house blueprint. A shallow copy xeroxes the top page — you get your own copy of the floor plan, but it still references the same shared plumbing diagrams stored in a folder. Change a room on your copy and it stays yours. But edit the shared plumbing folder and both copies are affected. A deep copy photocopies everything — the floor plan, every referenced diagram, every attachment. Your copy is completely independent. Changing anything in it has no effect on the original. In JavaScript, every object contains two kinds of things: primitive values like numbers and strings, which are copied by value, and nested objects or arrays, which are copied by reference. A shallow copy duplicates the outer container but the nested objects inside are still the same objects in memory — both the original and the copy point to the same nested data. A deep copy recursively duplicates everything so no part of the copy shares memory with the original. The key insight: the difference only becomes visible when you modify nested data. Changing a top-level property on a shallow copy leaves the original untouched. Changing a nested property propagates back to the original and every other shallow copy that points to the same nested object — which is exactly the class of bug that breaks React state updates, corrupts Redux stores, and produces the hardest-to-find mutations in production code.

The Explanation
Primitive values vs object references
Understanding the difference between shallow and deep copies requires understanding how JavaScript stores values in memory. Primitive types — numbers, strings, booleans, null, undefined, Symbol, BigInt — are stored directly. When you assign or copy them, you get an independent copy of the actual value.

let a = 42
let b = a
b = 100
console.log(a) // 42 — completely independent
Objects, arrays, and functions are stored as references. The variable holds a pointer to a location in memory, not the data itself. When you copy an object variable, you copy the pointer — both variables point to the same data.

const original = { name: 'Alice', scores: [90, 85, 92] }
const reference = original

reference.name = 'Bob'
console.log(original.name) // 'Bob' — same object in memory

reference.scores.push(88)
console.log(original.scores) // [90, 85, 92, 88] — same array
Shallow copy — one level deep
A shallow copy creates a new top-level object and copies the immediate properties. Primitive properties are truly independent. Nested object and array properties are still shared references.

Three ways to create a shallow copy:

const user = {
name: 'Alice',
age: 30,
address: { city: 'Mumbai', pin: '400001' },
scores: [90, 85, 92],
}

// 1. Object spread (most common)
const copy1 = { ...user }

// 2. Object.assign()
const copy2 = Object.assign({}, user)

// 3. Array spread for arrays
const arr = [1, [2, 3], [4, 5]]
const copy3 = [...arr]
// Top-level primitives are independent
copy1.name = 'Bob'
console.log(user.name) // 'Alice' — unaffected ✓

// But nested objects are still shared
copy1.address.city = 'Delhi'
console.log(user.address.city) // 'Delhi' — MUTATED ✗

copy1.scores.push(88)
console.log(user.scores) // [90, 85, 92, 88] — MUTATED ✗
This is the most common source of subtle bugs in React applications. Spreading state creates a shallow copy — changing a nested object in the copy mutates the original state object, bypassing React's change detection.

Deep copy method 1 — JSON.parse(JSON.stringify())
The quickest deep copy for simple data. Works well for plain data objects with no special types.

const user = {
name: 'Alice',
address: { city: 'Mumbai' },
scores: [90, 85, 92],
}

const deep = JSON.parse(JSON.stringify(user))

deep.address.city = 'Delhi'
console.log(user.address.city) // 'Mumbai' — truly independent ✓
The mechanism: JSON.stringify serializes the object to a JSON string (which contains no references, only data). JSON.parse deserializes that string into a brand-new object graph with no connection to the original.

Five significant limitations — these are the interview questions:

// 1. Functions are silently dropped
const obj1 = { name: 'Alice', greet: () => 'Hello' }
const copy = JSON.parse(JSON.stringify(obj1))
console.log(copy.greet) // undefined — function lost

// 2. undefined values are silently dropped
const obj2 = { a: 1, b: undefined }
JSON.parse(JSON.stringify(obj2)) // { a: 1 } — b is gone

// 3. Date objects become strings
const obj3 = { created: new Date('2024-01-01') }
const c = JSON.parse(JSON.stringify(obj3))
console.log(typeof c.created) // 'string' — not a Date
console.log(c.created instanceof Date) // false

// 4. Special number values become null
const obj4 = { a: Infinity, b: NaN, c: -Infinity }
JSON.parse(JSON.stringify(obj4)) // { a: null, b: null, c: null }

// 5. Circular references throw immediately
const obj5 = {}
obj5.self = obj5
JSON.parse(JSON.stringify(obj5)) // TypeError: circular structure
Deep copy method 2 — structuredClone() (modern standard)
structuredClone() was introduced in 2022 and is now supported in all modern browsers and Node.js 17+. It uses the Structured Clone Algorithm — the same mechanism browsers use internally to clone data for Web Workers and IndexedDB. It is faster than JSON and handles far more types correctly.

const user = {
name: 'Alice',
created: new Date('2024-01-01'),
scores: [90, 85, 92],
address: { city: 'Mumbai' },
}

const deep = structuredClone(user)

deep.address.city = 'Delhi'
console.log(user.address.city) // 'Mumbai' — independent ✓

console.log(deep.created instanceof Date) // true — Date preserved ✓
console.log(deep.created === user.created) // false — different object ✓
What structuredClone handles correctly:

// Dates — preserved as Date objects
structuredClone({ d: new Date() })

// RegExp — preserved
structuredClone({ r: /abc/gi })

// Map and Set — preserved with their contents
structuredClone({ m: new Map([[1, 'a']]) })

// Circular references — handled correctly!
const circular = {}
circular.self = circular
const clone = structuredClone(circular)
console.log(clone.self === clone) // true — circular structure reproduced ✓

// Typed Arrays, ArrayBuffer, Blob — preserved
structuredClone({ data: new Uint8Array([1, 2, 3]) })
What structuredClone cannot handle:

// Functions — throws DataCloneError
structuredClone({ fn: () => {} }) // DataCloneError: function not cloneable

// DOM nodes — throws DataCloneError
structuredClone({ el: document.body }) // DataCloneError

// class instances — loses prototype chain (becomes plain object)
class User { greet() { return 'Hi' } }
const u = new User()
u.name = 'Alice'
const clone = structuredClone(u)
console.log(clone instanceof User) // false — prototype lost
console.log(clone.greet) // undefined — method lost
Deep copy method 3 — recursive manual implementation
Implementing deep clone from scratch is a standard senior interview question. The key challenges are handling circular references (to avoid infinite recursion) and correctly identifying and cloning arrays vs plain objects.

function deepClone(value, seen = new WeakMap()) {
// Base case: primitives and null — return as-is
if (value === null || typeof value !== 'object') return value

// Handle Date
if (value instanceof Date) return new Date(value.getTime())

// Handle RegExp
if (value instanceof RegExp) return new RegExp(value.source, value.flags)

// Handle circular references: if we've seen this object before, return the clone
if (seen.has(value)) return seen.get(value)

// Preserve array vs object structure
const clone = Array.isArray(value) ? [] : {}

// Register before recursing — handles circular references during recursion
seen.set(value, clone)

for (const key of Object.keys(value)) {
clone[key] = deepClone(value[key], seen) // recurse into each property
}

return clone
}

// Test: nested objects
const original = { a: 1, nested: { b: 2, deep: { c: 3 } } }
const cloned = deepClone(original)
cloned.nested.b = 99
console.log(original.nested.b) // 2 — independent ✓

// Test: circular reference
const circular = { name: 'Alice' }
circular.self = circular
const clonedCircular = deepClone(circular)
console.log(clonedCircular.self === clonedCircular) // true ✓
console.log(clonedCircular === circular) // false ✓
The WeakMap tracks every object seen during the recursion. When a circular reference is encountered, the WeakMap returns the already-created clone of that object instead of recursing infinitely. This is the canonical approach interviewers expect.

Comparison table — when to use which
// Use shallow copy when:
// • You only need independence at the top level
// • Nested data will not be mutated
// • Performance matters more than deep independence
const shallowCopy = { ...obj }

// Use JSON.parse/JSON.stringify when:
// • Data is plain JSON-serializable (strings, numbers, arrays, nested objects)
// • No functions, Dates, undefined, Infinity, NaN, circular refs
// • Quick and readable code matters
const jsonCopy = JSON.parse(JSON.stringify(obj))

// Use structuredClone() when:
// • Modern environment (2022+, Node 17+)
// • Data contains Dates, RegExp, Map, Set, typed arrays, circular refs
// • Need better performance than JSON approach
const modernCopy = structuredClone(obj)

// Use recursive manual clone when:
// • Need to preserve class instances and prototype chains
// • Custom cloning logic for specific types
// • Interview context — demonstrates understanding
const customCopy = deepClone(obj)
Common Misconceptions
⚠️
Many devs think Object.spread and Object.assign create deep copies — but actually both create shallow copies. Only top-level properties are duplicated. Nested objects and arrays are still shared references between the original and the copy, so mutating a nested property on the copy mutates the original.

⚠️
Many devs think JSON.parse(JSON.stringify()) is a safe universal deep clone — but actually it silently drops functions, undefined values, and Symbol-keyed properties, converts Date objects to strings, turns Infinity and NaN into null, and throws a TypeError on circular references. It is only safe for plain JSON-serializable data.

⚠️
Many devs think structuredClone() can clone anything — but actually it throws a DataCloneError for functions and DOM nodes, and it loses the prototype chain of class instances, producing a plain object that fails instanceof checks and has no class methods. It is correct for data but not for class instances.

⚠️
Many devs think shallow copies are always wrong — but actually shallow copies are the right choice in most situations. When you only need the top-level to be independent, or when the nested data is not going to be mutated, a shallow copy is faster, simpler, and sufficient. React state updates often only need a shallow copy of the top-level object.

⚠️
Many devs think deep cloning is always safe — but actually deep cloning can cause unexpected behavior with class instances because prototype chains and methods are not copied by most clone techniques. It is also slower and more memory-intensive than shallow copying. Unnecessary deep cloning of large object trees is a real performance issue in render-heavy applications.

⚠️
Many devs think a circular reference is rare — but actually they appear frequently in real data structures: doubly-linked lists where each node references the next and previous, tree nodes with parent references, objects that reference their own container, and React component instances that reference their fibers. Not handling circular references in a manual deep clone causes a stack overflow.

Where You'll See This in Real Code
→
React state updates require understanding shallow vs deep copy at a fundamental level — setState({ ...prevState, settings: { ...prevState.settings, theme: 'dark' } }) is a nested spread because a single spread only copies the top level, and failing to spread nested objects is one of the most common sources of React state mutation bugs in production code.

→
Redux's time-travel debugging and state replay depend entirely on deep independence between state snapshots — Immer, the library used inside Redux Toolkit, uses JavaScript Proxy to track mutations and produce a structurally shared deep clone where only the changed branches are new objects, combining the correctness of deep copy with the performance of structural sharing.

→
Undo and redo systems in document editors like Figma and Notion store deep clones of the document state at each change — without deep independence, every snapshot would reference the same nested data and editing any snapshot would corrupt all others, making undo impossible.

→
JSON.parse and JSON.stringify are used as a deep clone trick in interview rounds at Razorpay and Flipkart specifically to test if candidates know the limitations — interviewers deliberately use a Date or circular reference in the follow-up to see if the candidate recognizes why the approach fails.

→
The structuredClone API was introduced natively in 2022 because the pattern of JSON.parse(JSON.stringify()) was so ubiquitous in production code that browser vendors and Node.js decided to standardize a correct, performant implementation — its widespread use in polyfill-period code before 2022 shows how common the need for deep cloning is in real applications.

→
Lodash's \_.cloneDeep remains one of the most downloaded npm utilities specifically because deep cloning requirements appear constantly in production JavaScript — form state management, configuration merging, test fixture setup, API response transformation, and immutable data pipelines all require it regularly.

⚡
Interview Cheat Sheet
✦
Shallow copy: new top-level container, nested objects/arrays still shared — { ...obj }, Object.assign(), [...arr]
✦
Deep copy: every level is independent — no shared references at any depth
✦
JSON.parse/JSON.stringify: drops functions, undefined, Symbol; converts Dates to strings; NaN/Infinity become null; throws on circular refs
✦
structuredClone(): handles Dates, RegExp, Map, Set, circular refs — throws on functions and DOM nodes, loses prototype chain
✦
Recursive manual clone: handles circular refs with WeakMap; preserves type-specific handling; needed for class instances
✦
Shallow copies are correct when top-level independence is enough and nested data will not be mutated
✦
React state: spread operator only copies one level — nested updates require spreading each nested level explicitly
✦
Circular reference fix: WeakMap tracks seen objects and returns existing clone instead of recursing
💡
How to Answer in an Interview

1.  For any deep clone question, immediately ask "does the data contain Dates, functions, circular references, or class instances?" — the answer determines the right technique
2.  Walk through JSON.parse/JSON.stringify first, then explain each limitation — this structure shows you know it and know why it is dangerous
3.  The circular reference WeakMap pattern is the differentiating answer for senior-level questions — candidates who only know JSON.stringify fail this
4.  Connect to React explicitly: "this is why you see two levels of spread in React state updates — each level that has nested objects needs its own spread"
5.  structuredClone is the modern correct answer for data — but mentioning it without knowing its function/prototype limitations suggests you only recently learned about it
