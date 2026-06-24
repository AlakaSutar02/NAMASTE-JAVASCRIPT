The Mental Model
JavaScript has two equality operators and they ask fundamentally different questions. === (strict equality) asks: "Are these the exact same thing?" Same type, same value. No compromises. If the types don't match, the answer is immediately false. It's a strict ID check — you must match on every attribute. == (loose equality) asks: "Could these reasonably be considered equal?" It's willing to convert types to find common ground. It follows a specific algorithm to decide which type to convert and in which direction. The analogy: === is a bouncer checking your exact ID. == is a parent trying to figure out if the food on the plate is "basically what you asked for." The parent might get creative with the comparison in ways that surprise you. For most code, use === and avoid the surprises. But understanding == deeply is required for interviews — and there are a few cases where == is genuinely the right tool.

The Explanation
Strict equality (===) — no coercion
With ===, if the types differ, the result is always false. No conversion happens.

1 === 1 // true
1 === "1" // false — different types
null === null // true
undefined === undefined // true
null === undefined // false — different types
NaN === NaN // false — special rule: NaN never equals itself

// Objects — compared by reference, not value
const a = { x: 1 }
const b = { x: 1 }
const c = a

a === b // false — different objects in memory
a === c // true — same reference
Loose equality (==) — the full algorithm
When types differ, == follows these rules in order:

Rule 1: null and undefined are only equal to each other
null == undefined // true — unique exception
null == 0 // false — null only == undefined
null == "" // false
null == false // false
undefined == 0 // false
undefined == "" // false
undefined == false // false
Rule 2: If one is a Number and the other a String — convert string to number
"42" == 42 // true — "42" → 42
"0" == 0 // true — "0" → 0
"" == 0 // true — "" → 0
"abc" == NaN // false — "abc" → NaN, NaN ≠ NaN
Rule 3: If one is a Boolean — convert boolean to number FIRST, then re-apply rules
// Boolean converts FIRST, before any other comparison
false == 0 // true — false → 0, 0 == 0
true == 1 // true — true → 1
true == "1" // true — true → 1, then "1" == 1, "1" → 1 = true
false == "" // true — false → 0, "" → 0
false == "0" // true — false → 0, "0" → 0

// The trap:
// Don't write: if (x == true) — it won't work as expected for x = 2
// true → 1, so you're checking if x == 1, not if x is truthy
// Write: if (x) instead
Rule 4: Object vs Primitive — call ToPrimitive on the object
// ToPrimitive tries valueOf() first, then toString()
[] == "" // true — [] → "" (toString), "" == ""
[0] == 0 // true — [0] → "0" → 0
[1,2] == "1,2" // true — [1,2] → "1,2"
{} == "[object Object]" // true — {} → "[object Object]"

// The famous ones:
[] == false // true — [] → "" → 0, false → 0
[] == ![] // true — ![] = false, then [] == false → true
The reference equality trap
Both == and === compare objects by reference, not by value. Two objects with identical contents are never equal unless they are the same object in memory.

// Both == and === use reference equality for objects
[1,2,3] === [1,2,3] // false — different array instances
[1,2,3] == [1,2,3] // false — different instances

// The only way to deeply compare objects: JSON, lodash, or manual
JSON.stringify(a) === JSON.stringify(b) // works for simple cases
\_.isEqual(a, b) // lodash deep equality

// Same reference = equal
const arr = [1,2,3]
const ref = arr
arr === ref // true — same reference
NaN — the exception to all equality
NaN === NaN // false — by design (IEEE 754)
NaN == NaN // false

// Correct checks:
Number.isNaN(NaN) // true — best, no coercion
isNaN(NaN) // true — but global isNaN coerces: isNaN("abc") = true
Object.is(NaN, NaN) // true — the reliable identity check
Object.is() — the strictest equality
Object.is() is like === but handles two edge cases differently:

// === edge cases:
NaN === NaN // false
+0 === -0 // true

// Object.is edge cases:
Object.is(NaN, NaN) // true — NaN equals itself
Object.is(+0, -0) // false — positive and negative zero are distinct

// Everything else is the same as ===
Object.is(1, 1) // true
Object.is(1, "1") // false
React uses Object.is() internally for comparison in useState, useMemo, and React.memo. Understanding this explains why setState(0) doesn't trigger a re-render if state is already 0, but does trigger one if state is -0.

When == is actually the right choice
// Checking for null OR undefined in one expression:
if (value == null) {
// runs for both null and undefined — intentional, readable
}

// Equivalent but more verbose:
if (value === null || value === undefined) { }

// Many style guides permit this specific use of ==
The complete equality decision tree
// Use === unless:
// 1. You're specifically checking for null/undefined → use == null
// 2. You need deep object comparison → use JSON.stringify or utility
// 3. You need NaN-safe identity → use Object.is()

// Never use == for:
// - Comparing numbers with strings (unless you want coercion explicitly)
// - Comparing with booleans (always convert with Boolean() first)
// - Checking if something is an array or object
Common Misconceptions
⚠️
Many devs think == just converts types randomly — but actually == follows a precise, deterministic algorithm defined in the ECMAScript specification. The results feel random because the algorithm is unintuitive, not because it's arbitrary. Every result is reproducible and explainable.

⚠️
Many devs think null == false is true — but actually null is special-cased to only loosely equal undefined and nothing else. This special case exists so you can safely check for "not provided" values without accidentally matching false, 0, or empty string.

⚠️
Many devs think === is always better than == — but actually there's one common legitimate use for ==: checking value == null catches both null and undefined in a single expression. Many codebases use this pattern intentionally. The problem isn't == itself — it's using == without understanding when it applies coercion.

⚠️
Many devs think two identical objects are equal — but actually {} === {} is false and {} == {} is also false. JavaScript compares objects by reference (memory address), not by contents. Two objects created separately are always two different objects, even if they look identical. Deep equality requires a utility function.

⚠️
Many devs think NaN === NaN should be true — but actually NaN (Not a Number) was designed to be non-reflexive: it represents an invalid computation result, and two invalid computations shouldn't be assumed equal. IEEE 754 floating point — which JavaScript uses — defines this behaviour. Use Number.isNaN() to check for NaN.

⚠️
Many devs think Object.is() is just a more verbose === — but actually it differs in two important cases: Object.is(NaN, NaN) is true (unlike ===), and Object.is(+0, -0) is false (unlike ===). React's reconciler uses Object.is() specifically because of the NaN difference — it needs to detect when state changes to NaN.

Where You'll See This in Real Code
→
React's reconciliation algorithm uses Object.is() for shallow comparison — this is why mutating state directly (user.name = 'Alice' without creating a new object) doesn't trigger re-renders, because Object.is(oldUser, oldUser) is true (same reference) even though the content changed.

→
The null coalescing operator (??) relies on strict null/undefined checking — unlike ||, which uses truthiness, ?? only activates for null or undefined. This distinction matters when 0, false, or empty string are valid values that should not fall back to the default.

→
Jest's toEqual() vs toBe() are the deep vs reference equality split in testing — toBe() uses Object.is() (strict reference), toEqual() recursively compares structure. Using toBe() to compare two objects with the same content will always fail, which is a common source of confusing test failures.

→
Type coercion in if conditions is one of the top sources of bugs found in JavaScript security audits — loose comparisons involving user input can sometimes allow unintended code paths when attackers send unexpected types in API requests, which is why TypeScript strict mode and linters flag == usage.

→
The == null pattern is used throughout the Vue.js and Lodash source code — it's a deliberate choice by experienced JavaScript developers who want concise null/undefined guards. Understanding why this specific use of == is safe is considered a mark of JavaScript fluency.

→
Angular's change detection used to rely on === comparisons for objects, which caused a common bug pattern where developers mutated objects in place and wondered why the view didn't update — the framework was comparing references, not values, and the reference hadn't changed.

⚡
Interview Cheat Sheet
✦
=== checks value AND type — no conversion; always prefer this
✦
== checks value after type coercion — many surprise results
✦
NaN === NaN is false — use Number.isNaN() or Object.is(NaN, NaN)
✦
null == undefined is true; null === undefined is false
✦
Object.is() is the most precise equality — handles NaN and -0 correctly
💡
How to Answer in an Interview

1.  Always recommend === and explain the one exception: x == null catches both null AND undefined
2.  Know the coercion table by heart: ToNumber, ToString, ToPrimitive rules
