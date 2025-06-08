
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
