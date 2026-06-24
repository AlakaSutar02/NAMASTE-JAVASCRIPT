async function example() {
  console.log("A"); // runs synchronously
  const result = await Promise.resolve("data"); // pauses HERE
  console.log("B", result); // resumes as a microtask
  return result;
}

console.log("1");
example();
console.log("2");

// Output: 1, A, 2, B data
// Why: '1' → example() starts → 'A' → await pauses example() →
// control returns to caller → '2' → microtask: resumes → 'B data'

// **************************************************************************************
console.log("1");
async function main() {
  console.log("2");
  await Promise.resolve();
  console.log("3");
}
main();
console.log("4");

// output: 1, 2, 4, 3
// Why: '1' → main() starts → '2' → await pauses main() →
// control returns to caller → '4' → microtask: resumes → '3'

// **************************************************************************************

async function run() {
  console.log("A");
  await null;
  console.log("B");
  await null;
  console.log("C");
}
run();
console.log("D");

// output : A, D, B, C
// Why: 'A' → await pauses run() → control returns to caller → 'D' → microtask: resumes →
// 'B' → await pauses run() → control returns to caller → microtask: resumes → 'C'
