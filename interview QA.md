### 🔄 Event Bubbling and Capturing in JavaScript

In JavaScript, when you interact with elements on a webpage (like clicking a button inside a `div`), events don't just happen at the element you clicked—they can travel **through the DOM tree**. This process is handled through **Event Bubbling** and **Event Capturing** (also called **Event Trickling**).

---

## 🧭 The Phases of Event Propagation

Every DOM event goes through **three phases**:

1. **Capturing Phase (Trickling Down)**
2. **Target Phase**
3. **Bubbling Phase (Bubbling Up)**

---

### 📌 1. Event Capturing (Trickling Down)

- The event starts from the topmost element (`document`) and **trickles down** to the target element.
- You can handle this phase by passing `true` as the third parameter in `addEventListener`.

```js
document.querySelector("#parent").addEventListener(
  "click",
  () => {
    console.log("Parent Capturing");
  },
  true
); // Capturing phase
```

---

### 🎯 2. Target Phase

- This is the **actual element** where the event occurred.
- Event listeners on the exact target element will trigger **regardless** of capturing or bubbling.

---

### 💬 3. Event Bubbling (Bubbling Up)

- The default behavior: After the event reaches the target, it **bubbles up** through its ancestors.
- This is the most commonly used phase (unless explicitly prevented).

```js
document.querySelector("#parent").addEventListener("click", () => {
  console.log("Parent Bubbling");
}); // Bubbling phase (default)
```

---

## 📊 Example

HTML:

```html
<div id="parent">
  <button id="child">Click Me</button>
</div>
```

JavaScript:

```js
document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent clicked");
});

document.getElementById("child").addEventListener("click", () => {
  console.log("Child clicked");
});
```

Output when button is clicked:

```
Child clicked
Parent clicked
```

➡️ This is bubbling in action: event goes **up** from child to parent.

---

## 🛑 Stop Propagation

Sometimes, you might want to stop the event from propagating further.

```js
child.addEventListener("click", function (e) {
  e.stopPropagation(); // Stops bubbling (or capturing)
  console.log("Only Child clicked");
});
```

---

## ✅ Summary Table

| Phase     | Order             | Uses `addEventListener(..., ..., true)` | Default? |
| --------- | ----------------- | --------------------------------------- | -------- |
| Capturing | Top → Target      | ✅                                      | ❌       |
| Target    | At target element | ✅ (always)                             | ✅       |
| Bubbling  | Target → Top      | ❌ (default phase)                      | ✅       |

---

## 🧠 Real Use Cases

- **Capturing** is rare, but useful in advanced patterns like logging all events early or preventing specific user behavior.
- **Bubbling** is widely used for **event delegation** (e.g., attaching one event listener to a parent for multiple children).

---

### 1. **HTML vs HTML5**

- **HTML**: Older versions, limited multimedia support, less semantic.
- **HTML5**: Modern version with new semantic tags (`<article>`, `<section>`), audio/video support, local storage, canvas, and improved form elements.

---

### 2. **Purpose of `<!DOCTYPE>`**

- Declares the document type and version of HTML.
- Helps browsers render the page in standards mode.

---

### 3. **Semantic HTML**

- Uses tags that convey meaning: `<header>`, `<nav>`, `<main>`, `<footer>`, etc.
- Improves accessibility, SEO, and readability.

---

### 4. **Types of CSS**

1. **Inline**: `<div style="color: red;">`
2. **Internal**: Inside `<style>` tags in the `<head>`.
3. **External**: Linked via `<link href="style.css">`

---

### 5. **CSS Box Model**

- Consists of:
  `Content → Padding → Border → Margin`
- Defines how elements take up space.

---

### 6. **id vs class**

- `id`: Unique per page (`#id`), used for specific elements.
- `class`: Reusable (`.class`), for grouping and styling multiple elements.

---

### 7. **`==` vs `===`**

- `==`: Loose equality, does type coercion (`'5' == 5` → `true`)
- `===`: Strict equality, no coercion (`'5' === 5` → `false`)

---

### 8. **Data attributes**

- Custom attributes prefixed with `data-`, e.g., `data-user-id="123"`.
- Accessed via JS: `element.dataset.userId`.

---

### 9. **`position: absolute`**

- Positions the element relative to the nearest positioned ancestor (not `static`).
- Removed from normal document flow.

---

### 10. **null, undefined, NaN**

- `null`: Intentional absence of value.
- `undefined`: Variable declared but not assigned.
- `NaN`: “Not a Number”, result of invalid numeric operations (e.g., `0 / 'a'`).

---

### 11. **Make Mobile-friendly design**

- Use **responsive design**: media queries, flexible grids, `%` or `vw/vh` units.
- Set viewport:

  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ```

---

### 12. **CSS pseudo-classes**

- Target elements based on state:

  - `:hover`, `:focus`, `:first-child`, `:nth-child(n)`, `:checked`, etc.

---

### 13. **let, var, const**

- `var`: Function-scoped, hoisted.
- `let`: Block-scoped, no hoisting.
- `const`: Block-scoped, immutable binding (value can still be mutable for objects).

---

### 14. **JS Primitive Types**

1. **String**
2. **Number**
3. **Boolean**
4. **Null**
5. **Undefined**
6. **BigInt**
7. **Symbol**

---

### 15. **Events in JS**

- Interactions like `click`, `keydown`, `submit`, etc.
- Example:

  ```js
  element.addEventListener("click", function () {
    alert("Clicked!");
  });
  ```

---

### 16. **Prevent default event**

- Stops default browser behavior (e.g., form submit).

  ```js
  event.preventDefault();
  ```

---

### 17. **Inline vs Block vs Inline-block**

- **Inline**: No width/height, flows with text (`<span>`)
- **Block**: Full width, new line (`<div>`)
- **Inline-block**: Like inline, but respects width/height

---

### 18. **Purpose of `<meta>`**

- Provides metadata: charset, viewport, SEO info.

  ```html
  <meta charset="UTF-8" />
  <meta name="description" content="Free Web tutorials" />
  ```

---

### 19. **Web safe fonts**

- Fonts supported across most devices:

  - Arial, Verdana, Times New Roman, Courier New, Georgia, etc.

---

### 20. **CSS specificity**

- Determines which rule is applied:

  - Inline styles > ID selectors > Class/pseudo-class > Element selectors
  - Calculated as: Inline (1000), ID (100), Class (10), Tag (1)

---

### 21. **`display: none` vs `visibility: hidden`**

- `display: none`: Removes from layout, not visible.
- `visibility: hidden`: Takes up space, but invisible.

---

### 22. **Viewport**

- The visible area of the web page on a device.
- Important for responsive design.

---

### 23. **z-index**

- Controls stacking order (higher = on top).
- Only works on positioned elements (`relative`, `absolute`, `fixed`, etc.)

---

### 24. **Self-closing tags**

- Do not require closing tag:

  ```html
  <img />, <br />,
  <hr />
  , <input />
  ```

---

### 25. **Global HTML attributes**

- Can be used on any element:

  - `id`, `class`, `style`, `title`, `data-*`, `hidden`, `tabindex`, `lang`, `dir`, etc.

---
...

#### 51. **JS Event Loop (G)**

* Manages the execution of synchronous and asynchronous code.
* Call stack processes sync tasks.
* Callback queue holds async tasks (macrotasks).
* Microtasks queue has Promises, `MutationObserver`.
* JS executes microtasks after each macrotask.

#### 52. **URL to Render Flow (G)**

1. DNS lookup
2. TCP handshake (TLS if HTTPS)
3. HTTP request to server
4. Server response
5. Browser parses HTML → DOM
6. Parses CSS → CSSOM
7. JS fetched and executed
8. DOM + CSSOM → Render Tree → Layout → Paint

#### 53. **Microtasks vs Macrotasks (G)**

| Task Type  | Examples                     |
| ---------- | ---------------------------- |
| Microtasks | Promises, MutationObserver   |
| Macrotasks | setTimeout, setInterval, I/O |

* Microtasks execute **before** the next render, immediately after the current task.

#### 54. **Layout Thrashing**

* Frequent forced reflows due to interleaving reads/writes to DOM.
* Avoid by batching DOM reads/writes.

```js
// Bad
el.style.width = el.offsetWidth + 10 + 'px';
// Good
const width = el.offsetWidth;
el.style.width = (width + 10) + 'px';
```

#### 55. **Browser Cache Control (G)**

* Uses HTTP headers to manage resource caching.

```http
Cache-Control: public, max-age=31536000
ETag: "abc123"
```

* Improves performance by avoiding repeated downloads.

#### 56. **Render Pipeline Stages**

1. DOM construction
2. CSSOM construction
3. Render tree
4. Layout (geometry)
5. Paint (pixels)
6. Composite (combine layers)

#### 57. **Build Secure Login Form (A)**

* Use HTTPS
* Validate input client & server side
* Hash passwords with bcrypt
* Use CSRF tokens
* Set `HttpOnly`, `Secure`, and `SameSite` on cookies

#### 58. **Prevent XSS (A)**

* Sanitize user input
* Escape output in HTML/JS
* Use Content Security Policy (CSP)
* Avoid `innerHTML` for dynamic content

#### 59. **Prevent CSRF (A)**

* Use SameSite cookies: `SameSite=Strict`
* CSRF tokens in forms
* Double-submit cookies pattern

#### 60. **Script Execution Order**

* Scripts block parsing unless:

  * `defer`: executes after DOMContentLoaded
  * `async`: executes as soon as downloaded
* Inline scripts execute immediately during parsing

#### 61. **Virtual Scroll (M)**

* Renders only visible items from large lists to improve performance.
* Used in chat apps, data tables.

#### 62. **Inline Styles Impact**

* Inline styles have high specificity.
* Cannot be cached or reused easily.
* May hurt maintainability and theming.

#### 63. **JS Garbage Collection (G)**

* JS uses mark-and-sweep algorithm.
* Collects memory from unreachable objects.
* Use `WeakMap`, `WeakSet` to avoid leaks in caches or listeners.

#### 64. **Web Workers (M)**

* Run JS in background threads.
* Useful for CPU-intensive tasks.

```js
const worker = new Worker('worker.js');
```

#### 65. **Debug JS Memory Leaks (M)**

* Use Chrome DevTools > Memory tab
* Take heap snapshots
* Look for detached DOM nodes and listeners

#### 66. **CSS Containment / Painting**

* `contain` property tells browser which parts are isolated

```css
div { contain: layout style paint; }
```

* Improves performance by limiting reflows.

#### 67. **Blink vs WebKit vs Gecko**

* **Blink**: Chrome, Edge
* **WebKit**: Safari
* **Gecko**: Firefox
* Rendering engines impact layout/behavior; test on all

#### 68. **innerHTML Risks**

* Easily exposes to XSS attacks if user content is inserted.
* Avoid for untrusted input. Use `textContent` or DOM APIs.

#### 69. **HTTPS + TLS (A)**

* Ensures encryption and integrity between browser and server.
* TLS handshake establishes secure channel.

#### 70. **Layout Performance in DevTools (D)**

* Use Chrome DevTools > Performance tab
* Record session, inspect layout/paint timing
* Look for long layout durations or forced reflows

#### 71. **eval() Risks**

* Executes arbitrary code
* Can lead to XSS, scope pollution, and poor performance
* Avoid using `eval()`

#### 72. **Stream Backpressure**

* Occurs when writable stream can't keep up with readable stream
* Handled using `WritableStream` APIs in browser

#### 73. **HTTP/2 vs HTTP/3 (G)**

| Protocol | Features                                            |
| -------- | --------------------------------------------------- |
| HTTP/2   | Multiplexing, HPACK, binary framing                 |
| HTTP/3   | Based on QUIC, faster handshakes, better for mobile |

#### 74. **3rd-Party Performance Regressions (D)**

* Heavy scripts (ads, analytics) can delay paint
* Audit with Lighthouse or Performance tab
* Load them async or defer

#### 75. **JS Sandboxing**

* Isolate untrusted code (e.g. iframe, workers)
* Tools: `vm2`, `sandboxed iframe`, `CSP`, Web Workers
