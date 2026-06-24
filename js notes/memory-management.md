## JavaScript uses an automatic process called Garbage Collection (GC) to free up memory. Modern engines use an algorithm called Mark-and-Sweep.

### "If your active code can't reach an object, the system considers it junk and deletes it."

```
let user = { name: "Alice" }; // Memory allocated
user = null;                  // The object is now unreachable. GC will delete it.
```

## What is a Memory Leak?

### A memory leak happens when your code accidentally holds onto a reference to an object that you don't need anymore. Because the reference still exists, the Garbage Collector cannot delete it, and your app consumes more and more RAM.

Leak #1: Forgotten Event Listeners
If you add an event listener to a global object (like window or document) inside a component or page, it stays there forever—even if that page or component is destroyed.

Leak #2: Accidental Global Variables
If you assign a value to a variable without declaring it using const or let, JavaScript attaches it to the global window object.

The Fix: Clear out the reference.

---

## 3. The Interview "Pro-Tip": Map vs. WeakMap

Interviewers love asking how to prevent caches from leaking memory.

- A standard `Map` holds a **strong** reference to its keys. If you use an object as a key, that object will _never_ be garbage collected as long as the Map exists.
- A `WeakMap` holds a **weak** reference. If the object key has no other references left in the app, the Garbage Collector will destroy the object _and_ automatically remove it from the WeakMap.

```javascript
let element = { id: 1 };

const strongCache = new Map();
strongCache.set(element, "metadata");

const weakCache = new WeakMap();
weakCache.set(element, "metadata");

element = null; // We are done with the object!

// Result:
// strongCache STILL keeps the object alive in memory. (Leak!)
// weakCache allows the object to be entirely deleted by GC. (Clean!)
```

## JavaScript uses automatic garbage collection — memory is freed when objects become unreachable from the "roots" (globals + active call stack).

Mark-and-Sweep algorithm:
Start from roots (global scope + call stack) --> Mark every reachable object --> Sweep — free everything NOT marked

```
let user = { name: 'Alice' }; // reachable via 'user'
user = null;                  // reference dropped → unreachable → GC'd

// Circular reference — NOT a problem for modern mark-and-sweep
let a = {}; let b = {};
a.ref = b; b.ref = a; // circular — but if a and b lose all external refs, both are GC'd

```

### Common memory leak sources:

Forgotten setInterval holding references to DOM elements

Detached DOM nodes still referenced in JS variables

Event listeners never removed (removeEventListener)

Closures unintentionally capturing large objects

Unbounded caches / global arrays that grow forever

💡 Use WeakMap/WeakRef to associate data with objects without preventing GC. DevTools Memory tab → Heap Snapshot to hunt leaks.

WeakRef: hold object without preventing GC; FinalizationRegistry: callback when object is collected
