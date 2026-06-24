// Creating a Map
const map = new Map();

// Setting entries — key can be ANY value
map.set("string key", "value 1");
map.set(42, "value 2");
map.set(true, "value 3");

const objKey = { id: 1 };
const fnKey = () => {};
map.set(objKey, "value for object key");
map.set(fnKey, "value for function key");
map.set(null, "null is a valid key");
map.set(NaN, "NaN is a valid key");

// Initialize with entries
const map2 = new Map([
  ["name", "Alice"],
  ["age", 30],
  ["role", "admin"],
]);

// Core operations — all O(1)
map2.get("name"); // 'Alice'
map2.get("missing"); // undefined — not an error
map2.has("age"); // true
map2.has("missing"); // false
map2.size; // 3 — not .length like arrays
map2.set("name", "Bob"); // overwrite existing key
map2.delete("role"); // true — returns boolean
map2.clear(); // removes all entries
