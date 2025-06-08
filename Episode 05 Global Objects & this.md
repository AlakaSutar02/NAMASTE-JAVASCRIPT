## 🌐 Episode 5: Global Objects & `window` and `this` Keyword

### 📦 The Shortest JavaScript Program

The shortest valid JavaScript program is an empty file. Even with no code, the JS engine still creates the **Global Execution Context (GEC)**. This includes:

* Memory space (Variable Environment)
* Code execution environment
* The **global object**
* The **`this` keyword**

### 🌍 The `window` Object in Browsers

In a browser environment, the global object is named `window`. This object:

* Is automatically created in the global scope
* Contains built-in methods (like `alert`, `setTimeout`, etc.) and properties
* Is accessible from anywhere in the program

### 🤝 The `this` Keyword at Global Scope

At the global level:

```js
this === window; // true (in browsers)
```

The `this` keyword refers to the global object. So when you declare a variable globally using `var`, it gets attached to the `window` object:

### 📌 Example:

```js
var x = 10;
console.log(x);        // 10
console.log(this.x);   // 10
console.log(window.x); // 10
```

### 🧠 Note:

In **Node.js**, the global object is not `window`; it’s called `global`. So:

```js
this === global; // true in Node.js
```

Thus, global context setup differs by environment, but the concept of a global object and `this` remains consistent.

---
