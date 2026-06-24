// Creating arrays
// Literal — always prefer this
const nums = [1, 2, 3];
const mixed = [1, "two", true, null, { x: 1 }, [2, 3]];

// Array.from — convert any iterable or array-like to a real array
Array.from("hello"); // ['h', 'e', 'l', 'l', 'o']
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]
Array.from(new Set([1, 2, 2, 3])); // [1, 2, 3] — deduplicate
Array.from(new Map([["a", 1]])); // [['a', 1]]
Array.from(document.querySelectorAll("div")); // NodeList → real array

// Array.of — creates array from arguments (unlike Array() which has quirks)
Array.of(3); // [3] — one element
Array(3); // [,,] — sparse array with 3 empty slots (not [3]!)
Array(1, 2, 3); // [1, 2, 3]

// Spread from any iterable
const copy = [...nums];
const merged = [...arr1, ...arr2, extraItem];

//*************************************************************************************************
// Mutating methods — modify the original array
const arr = [1, 2, 3, 4, 5];

// Add / remove
arr.push(6); // adds to end → returns new length → [1,2,3,4,5,6]
arr.pop(); // removes from end → returns removed element
arr.unshift(0); // adds to start → returns new length (SLOW on large arrays)
arr.shift(); // removes from start → returns removed element (SLOW)

// splice — the Swiss Army knife of mutation
arr.splice(2, 1); // at index 2, remove 1 → returns removed elements
arr.splice(1, 2, "a", "b"); // at index 1, remove 2, insert 'a','b'
arr
  .splice(2, 0, "inserted") // at index 2, remove 0, insert 'inserted'

  [
    // sort — mutates the original, returns same array
    (3, 1, 4, 1, 5)
  ].sort() // [1, 1, 3, 4, 5] — lexicographic by default
  [(10, 9, 2, 100)].sort() // [10, 100, 2, 9] — string sort: WRONG for numbers!
  [(10, 9, 2, 100)].sort((a, b) => a - b) // [2, 9, 10, 100] — numeric ascending
  [(10, 9, 2, 100)].sort((a, b) => b - a) // [100, 10, 9, 2] — numeric descending

  [
    // reverse — mutates, returns same array
    (1, 2, 3)
  ].reverse(); // [3, 2, 1]

// fill — fills elements with a value
new Array(5)
  .fill(0) // [0, 0, 0, 0, 0]
  [(1, 2, 3, 4, 5)].fill(0, 2, 4); // [1, 2, 0, 0, 5] — fill from index 2 to 4

//*************************************************************************************************
// Non-mutating methods — return a new array or value
const arr = [1, 2, 3, 4, 5]

// Transforming
arr.map(x => x * 2)          // [2, 4, 6, 8, 10] — same length
arr.filter(x => x % 2 === 0) // [2, 4] — shorter or same length
arr.reduce((acc, x) => acc + x, 0)  // 15 — single value

// Copying / slicing
arr.slice()          // [1, 2, 3, 4, 5] — full copy
arr.slice(1, 3)      // [2, 3] — from index 1 up to (not including) 3
arr.slice(-2)        // [4, 5] — last 2

// Combining
arr.concat([6, 7])   // [1, 2, 3, 4, 5, 6, 7]
[...arr, 6, 7]       // same — spread preferred

// Joining
arr.join(', ')       // '1, 2, 3, 4, 5'
arr.join('')         // '12345'

// Flattening
[[1, 2], [3, 4]].flat()          // [1, 2, 3, 4]
[1, [2, [3, [4]]]].flat(Infinity) // [1, 2, 3, 4] — fully flatten
arr.flatMap(x => [x, x * 2])    // [1,2, 2,4, 3,6...] — map then flat(1)

// ES2023 — non-mutating sort and reverse (return copies)
arr.toSorted((a, b) => a - b)  // new sorted array — original unchanged
arr.toReversed()                // new reversed array — original unchanged
arr.toSpliced(2, 1, 'new')     // new spliced array — original unchanged
arr.with(2, 'replaced')        // new array with index 2 changed — original unchanged

//*************************************************************************************************
// Searching and testing
const users = [
  { id: 1, name: 'Alice', active: true  },
  { id: 2, name: 'Bob',   active: false },
  { id: 3, name: 'Carol', active: true  },
]

// Finding
users.find(u => u.id === 2)          // { id: 2, name: 'Bob', active: false }
users.findIndex(u => u.id === 2)     // 1
users.findLast(u => u.active)        // { id: 3, name: 'Carol', active: true } (ES2023)
users.findLastIndex(u => u.active)   // 2

// Includes / indexOf
[1, 2, 3].includes(2)         // true
[1, 2, NaN].includes(NaN)     // true — uses SameValueZero (unlike ===)
[1, 2, 3].indexOf(2)          // 1
[1, 2, 3].indexOf(99)         // -1 — not found
[1, 2, 3].lastIndexOf(2)      // 1

// Testing
users.every(u => u.id > 0)    // true  — all pass
users.some(u => !u.active)    // true  — at least one fails
users.every(u => u.active)    // false — not all active
//*************************************************************************************************
// Destructuring arrays
const [first, second, ...rest] = [1, 2, 3, 4, 5]
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements with commas
const [,, third] = [1, 2, 3, 4]   // third = 3

// Default values
const [a = 10, b = 20] = [1]      // a = 1, b = 20

// Swap variables without temp
let x = 1, y = 2
;[x, y] = [y, x]                  // x = 2, y = 1

// From function return
function getRange() { return [0, 100] }
const [min, max] = getRange()

//*************************************************************************************************
// Common patterns and pitfalls

// Removing duplicates
const unique = [...new Set([1, 2, 2, 3, 3, 3])]  // [1, 2, 3]

// Flattening with flatMap
const sentences = ['Hello world', 'Foo bar']
const words = sentences.flatMap(s => s.split(' '))
// ['Hello', 'world', 'Foo', 'bar']

// Group by (ES2024 / via reduce)
const grouped = users.reduce((acc, user) => {
  const key = user.active ? 'active' : 'inactive'
  ;(acc[key] ??= []).push(user)
  return acc
}, {})
// Object.groupBy(users, u => u.active ? 'active' : 'inactive') — ES2024

// sort() without comparator — the classic bug
[10, 9, 100, 2].sort()              // [10, 100, 2, 9] — string comparison!
[10, 9, 100, 2].sort((a, b) => a-b) // [2, 9, 10, 100] ✓

//  Using delete to remove an element — leaves holes
const arr = [1, 2, 3]
delete arr[1]    // [1, empty, 3] — length is still 3! Use splice instead
arr.splice(1, 1) // [1, 3] ✓

//  Mutating in map — always return new values
users.map(u => { u.active = false; return u })  // mutates original objects!
users.map(u => ({ ...u, active: false }))        // ✓ creates new objects

// Mutating vs non-mutating — the complete reference

// MUTATE the original array:
// push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin

// Return NEW array or value (original unchanged):
// map, filter, reduce, reduceRight, slice, concat, flat, flatMap,
// find, findIndex, findLast, findLastIndex, indexOf, lastIndexOf,
// includes, every, some, forEach, join, entries, keys, values,
// toSorted, toReversed, toSpliced, with  // ES2023 — explicit non-mutating versions

