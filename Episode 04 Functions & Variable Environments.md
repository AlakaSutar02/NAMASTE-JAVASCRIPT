## 🔍 Episode 4: Functions and Variable Environments

```js
var x = 1;
a();
b();
console.log(x); // 1

function a() {
  var x = 10;
  console.log(x); // 10
}

function b() {
  var x = 100;
  console.log(x); // 100
}
```

### 🧪 Output:

```
10
100
1
```

### 📈 Code Flow and Execution Contexts

1. A **Global Execution Context (GEC)** is created and pushed onto the **Call Stack**.

   > Call Stack: `[GEC]`

2. **Memory Creation Phase (GEC):**

   * `x` is allocated with `undefined`
   * Functions `a` and `b` are stored with their full definitions

3. **Code Execution Phase (GEC):**

   * `x = 1`

   * `a()` is invoked → a new Execution Context for `a()` is created and pushed to the stack

   > Call Stack: `[GEC, a()]`

   * Inside `a()`:

     * `x` is locally declared and initialized as `10`

     * Logs: `10`

     * Execution context for `a()` is popped from the stack

   > Call Stack: `[GEC]`

4. `b()` is invoked → a new Execution Context for `b()` is created

   > Call Stack: `[GEC, b()]`

   * Inside `b()`:

     * `x` is locally declared and initialized as `100`

     * Logs: `100`

     * Execution context for `b()` is popped from the stack

   > Call Stack: `[GEC]`

5. `console.log(x)` prints the global variable `x = 1`

6. Execution completes → GEC is popped and the program ends


---
