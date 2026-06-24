1 === 1; // true
1 === "1"; // false — different types
null === null; // true
undefined === undefined; // true
null === undefined; // false — different types
NaN === NaN; // false — special rule: NaN never equals itself

// Objects — compared by reference, not value
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b; // false — different objects in memory
a === c; // true  — same reference

// Rule 1: null and undefined are only equal to each other
null == undefined; // true  — unique exception
null == 0; // false — null only == undefined
null == ""; // false
null == false; // false
undefined == 0; // false
undefined == ""; // false
undefined == false; // false

// Rule 2: If one is a Number and the other a String — convert string to number
"42" == 42; // true  — "42" → 42
"0" == 0; // true  — "0" → 0
"" == 0; // true  — "" → 0
"abc" == NaN; // false — "abc" → NaN, NaN ≠ NaN

// Rule 3: If one is a Boolean — convert boolean to number FIRST, then re-apply rules
// Boolean converts FIRST, before any other comparison
false == 0; // true   — false → 0, 0 == 0
true == 1; // true   — true → 1
true == "1"; // true   — true → 1, then "1" == 1, "1" → 1 = true
false == ""; // true   — false → 0, "" → 0
false == "0"; // true   — false → 0, "0" → 0

// The trap:
// Don't write: if (x == true) — it won't work as expected for x = 2
// true → 1, so you're checking if x == 1, not if x is truthy
// Write: if (x) instead


// Rule 4: Object vs Primitive — call ToPrimitive on the object

// ToPrimitive tries valueOf() first, then toString()
[] == ""        // true  — [] → "" (toString), "" == "" 
[0] == 0        // true  — [0] → "0" → 0
[1,2] == "1,2"  // true  — [1,2] → "1,2"
{} == "[object Object]"  // true — {} → "[object Object]"

// The famous ones:
[] == false     // true  — [] → "" → 0, false → 0
[] == ![]       // true  — ![] = false, then [] == false → true

// Both == and === use reference equality for objects
[1,2,3] === [1,2,3]  // false — different array instances
[1,2,3] == [1,2,3]   // false — different instances

// The only way to deeply compare objects: JSON, lodash, or manual
JSON.stringify(a) === JSON.stringify(b)  // works for simple cases
_.isEqual(a, b)  // lodash deep equality

// Same reference = equal
const arr = [1,2,3]
const ref = arr
arr === ref  // true — same reference
