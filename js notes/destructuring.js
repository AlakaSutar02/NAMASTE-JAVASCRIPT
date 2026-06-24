//Destructuring doesn't mutate the original — it creates new bindings.
// Combine default params + destructuring for clean, self-documenting function signatures.

// ── Array destructuring (position-based) ─────
const [a, b, c] = [1, 2, 3];
const [first, , third] = [1, 2, 3]; // skip index 1
const [x, ...rest] = [1, 2, 3, 4]; // x=1, rest=[2,3,4]
const [p = 10, q = 20] = [1]; // p=1, q=20 (default)
// ── Object destructuring (name-based) ────────
const { name, age } = { name: "Alice", age: 25 };
const { name: userName } = { name: "Alice" }; // rename to userName
const { city = "NYC" } = {}; // default if undefined

// ── Nested ────────────────────────────────────
const {
  address: { city: town },
} = { address: { city: "Paris" } };
// town = 'Paris'

// ── In function parameters ────────────────────
function greet({ name, age = 18, role = "user" }) {
  return `${name} (age:${age}, ${role})`;
}

// ── Swap variables ────────────────────────────
let m = 1,
  n = 2;
[m, n] = [n, m]; // m=2, n=1

// ── In loops ─────────────────────────────────
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

//Array destructuring with skip and rest
const [first, , third, ...rest] = [1, 2, 3, 4, 5];
console.log(first); //1
console.log(third); //3
console.log(rest.join(",")); //4,5

//Spread copy before sort preserves original
const original = [3, 1, 2];
const sorted = [...original].sort();
console.log(original.join(",")); //3,1,2
console.log(sorted.join(",")); //1,2,3

//Object spread — later properties win
const base = { x: 1, y: 2 };
const override = { y: 20, z: 3 };
const merged = { ...base, ...override };
console.log(merged.x); //1
console.log(merged.y); //20 because override has y:20
console.log(merged.z); //3

//  Expand iterable into individual elements — arrays, function args, object spreading

// 1. Spread in function calls — expand array as arguments
const nums = [1, 5, 3, 2, 4];
Math.max(...nums); // 5 — same as Math.max(1,5,3,2,4)
// 2. Copy and combine arrays (immutable operations)
const a = [1, 2, 3];
const b = [4, 5, 6];
const copy = [...a]; // [1,2,3] — shallow copy
const merged = [...a, ...b]; // [1,2,3,4,5,6]
const prepend = [0, ...a]; // [0,1,2,3]

// 3. Spread in object literals (ES2018)
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 }; // { a:1, b:2, c:3 }
const override = { ...base, b: 99 }; // { a:1, b:99 } — later wins

// 4. Convert iterable to array
const set = new Set([1, 2, 3]);
[...set]; // [1,2,3]
[..."hello"]; // ['h','e','l','l','o']
[...document.querySelectorAll("p")]; // NodeList → Array

// 5. Clone + update (immutable pattern)
const state = { user: "Alice", count: 0 };
const newState = { ...state, count: state.count + 1 };
