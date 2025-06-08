

## ⚙️ Episode 2: How JavaScript is Executed & the Call Stack

When a JavaScript program starts running, the js engine creates a **Global Execution Context (GEC)**. This context is built in **two phases**:

### 🔹 1. Memory Creation Phase

JavaScript scans through the entire code and:

* Allocates memory for all **variables** and **functions**
* Initializes variables with the value `undefined`
* Stores full **function definitions** in memory

#### 📌 Example:

```js
var n = 2;
function square(num) {
  var ans = num * num;
  return ans;
}
var square2 = square(n);
var square4 = square(4);
```

**🔸 During the memory phase:**

* `n` → `undefined`
* `square` → function definition stored
* `square2`, `square4` → `undefined`

---
### 🔹 2. Code Execution Phase

After memory is allocated, JavaScript begins **executing the code line-by-line**:

1. `n = 2` → updates `n` from `undefined` to `2`
2. `square` is referenced but not executed
3. `square2 = square(n)`:

   * A new **Execution Context** is created
   * Inside it:

     * `num = 2`
     * `ans = num * num = 4`
     * `return ans` → returns `4` and destroys the function's context
4. Same steps repeat for `square(4)`

---

### 📦 Final State Before Complete Teardown

At this point, all function execution contexts have returned their values and been **popped off the stack**. Only the **Global Execution Context** remains until the program finishes.

---

### 🧰 The Call Stack

JavaScript uses a **Call Stack** to manage the order and execution of function calls:

* When a function is called → its **execution context is pushed** onto the stack
* When the function returns → its context is **popped off** the stack

This system ensures JavaScript follows a **Last-In, First-Out (LIFO)** execution model.

#### 📌 Other Names for the Call Stack:

* Program Stack
* Control Stack
* Runtime Stack
* Machine Stack
* Execution Context Stack
