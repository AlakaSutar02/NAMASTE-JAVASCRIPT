## 🧠 Episode 3: Hoisting in JavaScript (Variables & Functions)

Let's examine the behavior of the following code:

```js
getName();        // Output: Namaste Javascript
console.log(x);   // Output: undefined

var x = 7;
function getName() {
  console.log("Namaste Javascript");
}
```

In many programming languages, accessing a variable before its declaration would cause an error. However, in JavaScript, due to **hoisting**, the above code executes with partial success:

* The function `getName` is hoisted with its full definition.
* The variable `x` is hoisted and initialized with `undefined`.

If `var x = 7;` were removed, accessing `x` would throw:

```
Uncaught ReferenceError: x is not defined
```

### 🔍 What is Hoisting?

**Hoisting** is a JavaScript mechanism where variable and function declarations are moved to the top of their scope during the **memory creation phase** of the execution context.

* Variables declared with `var` are hoisted with value `undefined`.
* Functions are hoisted with their complete definitions.

### 📌 Another Example:

```js
getName();               // Output: Namaste JavaScript
console.log(x);          // Error: x is not defined
console.log(getName);    // Logs the full function definition

function getName() {
  console.log("Namaste JavaScript");
}
```

Here, `getName()` is successfully invoked because the function is hoisted. But `x` is not declared, so accessing it throws a **ReferenceError**.

### ⚠️ Function Expressions are Not Fully Hoisted:

```js
getName();               // TypeError: getName is not a function
console.log(getName);    // undefined

var getName = function () {
  console.log("Namaste JavaScript");
};
```

In this case:

* `getName` is treated as a variable and hoisted with `undefined`.
* Attempting to invoke it before assignment throws a **TypeError**.

> ⚠️ **Summary:** Function declarations are hoisted completely. Function expressions are hoisted as variables only.

---
