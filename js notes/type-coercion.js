Boolean("0")        // true  — non-empty string, even if it's "0"
Boolean("false")    // true  — non-empty string
Boolean([])         // true  — empty array is truthy
Boolean({})         // true  — empty object is truthy
Boolean(function(){}) // true
Boolean(-1)         // true  — any non-zero number

Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN
Number("")          // 0
Number(" ")         // 0  (whitespace strings → 0)
Number("42")        // 42
Number("3.14")      // 3.14
Number("42abc")     // NaN  (can't fully parse)
Number([])          // 0   ([] → "" → 0)
Number([3])         // 3   ([3] → "3" → 3)
Number([1,2])       // NaN ([1,2] → "1,2" → NaN)
Number({})          // NaN ({} → "[object Object]" → NaN)


String(true)        // "true"
String(false)       // "false"
String(null)        // "null"
String(undefined)   // "undefined"
String(0)           // "0"
String(-0)          // "0"  ← watch out
String([1,2,3])     // "1,2,3"
String([])          // ""
String({})          // "[object Object]"

"5" + 3          // "53"  — 3 coerced to string
5 + "3"          // "53"
"5" + true       // "5true"
"5" + null       // "5null"
"5" + undefined  // "5undefined"
5 + null         // 5    — null coerced to 0
5 + undefined    // NaN  — undefined coerced to NaN
5 + true         // 6    — true coerced to 1
[] + []          // ""   — both become "", concatenated
[] + {}          // "[object Object]"
{} + []          // 0    — {} parsed as empty block, +[] = 0


"5" - 3          // 2    — "5" → 5
"5" * "2"        // 10   — both to numbers
true + true      // 2    — both → 1
false * 5        // 0
null * 5         // 0    — null → 0
undefined * 5    // NaN  — undefined → NaN
"abc" - 1        // NaN  — "abc" → NaN


// Type matching — no coercion
1 == 1          // true
"a" == "a"      // true

// null == undefined — special case, always true
null == undefined   // true
null == 0           // false  ← critical interview trap
null == false       // false
undefined == false  // false

// Number vs String — string converts to number
"42" == 42      // true   ("42" → 42)
"0" == 0        // true   ("0" → 0)
"" == 0         // true   ("" → 0)

// Boolean vs anything — boolean converts to number FIRST
true == 1       // true   (true → 1)
false == 0      // true   (false → 0)
true == "1"     // true   (true → 1, then "1" == 1, "1" → 1)
false == ""     // true   (false → 0, "" → 0)
false == "0"    // true   (false → 0, "0" → 0)

// Object vs primitive — calls valueOf() or toString()
[0] == false    // true   ([0] → "0" → 0, false → 0)
[] == false     // true   ([] → "" → 0, false → 0)
[] == 0         // true   ([] → "" → 0)
"" == false     // true   (false → 0, "" → 0)


// To number
Number("42")          // 42 — clearest
parseInt("42px", 10)  // 42 — parses integer, stops at non-numeric
parseFloat("3.14em")  // 3.14
+"42"                 // 42 — unary + (common, but less readable)
"42" * 1              // 42 — works but confusing

// To string
String(42)            // "42" — clearest
(42).toString()       // "42"
`${42}`               // "42" — template literal

// To boolean
Boolean(value)        // clearest
!!value               // common shorthand — double negation


typeof NaN          // "number" — NaN is a number type
NaN === NaN         // false    — NaN is not equal to itself
NaN == NaN          // false    — same

// Correct way to check for NaN:
Number.isNaN(NaN)   // true
Number.isNaN("NaN") // false — doesn't coerce, unlike global isNaN()
isNaN("abc")        // true  — global isNaN coerces first, unreliable


/// que 1:
let a = null;
let b = 0;
let c = 'existing';
a ??= 'default';
b ||= 'fallback';
c &&= 'updated';
console.log(a);
console.log(b);
console.log(c);

// a ??= 'default';
// How it works: It only assigns the right-hand value if the left-hand variable 
// is nullish (null or undefined).
// Evaluation: Since a is null, the assignment happens.
// Result: a becomes 'default'.


// b ||= 'fallback';
// How it works: It assigns the right-hand value if the left-hand variable is any
//  falsy value (like false, 0, "", null, undefined, or NaN).
// Evaluation: Since b is 0, it is falsy. Therefore, the assignment triggers.
// Result: b becomes 'fallback'.

// c &&= 'updated';
// How it works: It assigns the right-hand value only if the left-hand variable is truthy.
// Evaluation: Since c is 'existing', which is truthy, the assignment happens.
// Result: c becomes 'updated'.

