let originalObject = { a: 1, b: { c: 2 } };
let shallowCopy = { ...originalObject };
let deepCopy = JSON.parse(JSON.stringify(originalObject));

Promise.resolve().then(() => {
  originalObject.b.c = 3;
  shallowCopy.b.c = 10;
  console.log("Shallow Copy:", shallowCopy.b.c);
  console.log("Deep Copy:", deepCopy.b.c);
});

let original = { a: 1, b: { c: 2 } };
let shallowCopy = { ...original };
let deepCopy = JSON.parse(JSON.stringify(original));

Promise.resolve().then(() => {
  shallowCopy.a = 10;
  shallowCopy.b.c = 20;
  deepCopy.a = 30;
  deepCopy.b.c = 40;
  console.log(original.a, original.b.c);
  console.log(shallowCopy.a, shallowCopy.b.c);
  console.log(deepCopy.a, deepCopy.b.c);
});

//why  shallowCopy.b.c is changed to 20 when we change it in shallowCopy, but originalObject.b.c is changed to 3 when we change it in originalObject?
// In JavaScript, when you create a shallow copy of an object using the spread operator (`...`), it only copies the top-level properties.
// If any of those properties are objects themselves (like `b` in this case), the reference to that object is copied, not the actual object.
// This means that both the original and the shallow copy point to the same nested object.
//  Therefore, when you change `shallowCopy.b.c`, it also changes `originalObject.b.c` because they reference the same object in memory.

// Output:
// 1 20 explanation: The original object's 'a' remains unchanged at 1, but 'b.c' is changed to 20 due to the shallow copy. The deep copy has its own separate values, so 'a' is 30 and 'b.c' is 40.
// 10 20 explanation: The shallow copy's 'a' is changed to 10, and 'b.c' is changed to 20. The deep copy's 'a' is 30 and 'b.c' is 40, unaffected by changes to the original or shallow copy.
// 30 40 explanation: The deep copy's 'a' is changed to 30, and 'b.c' is changed to 40. The original and shallow copy remain unaffected by changes to the deep copy.

// Deep Copy and Shallow Copy in Asynchronous Operations
let originalObject = { a: 1, b: { c: 2 } };
let shallowCopy = { ...originalObject };
let deepCopy = JSON.parse(JSON.stringify(originalObject));
originalObject.b.c = 3;
console.log(shallowCopy.b.c); // Output: 3
console.log(deepCopy.b.c); // Output: 2
// In this example, we create an original object with a nested object.
// We then create a shallow copy using the spread operator and a deep copy using JSON methods.
// When we change the nested property `b.c` in the original object, it also changes in the shallow copy because they reference the same nested object. However, the deep copy remains unaffected because it has its own separate copy of the nested object.
