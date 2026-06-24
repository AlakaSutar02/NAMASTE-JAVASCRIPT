The Mental Model
Picture a brilliant but lazy mathematician. Every time you ask them to calculate something, they write the answer on a sticky note and slap it on their desk. The next time you ask the same question, they do not recalculate — they glance at the note and read the answer back instantly. That is memoization. A memoized function solves a problem once, stores the result, and serves it instantly from a cache when the same problem appears again. The calculation never runs twice for the same input. The key insight: memoization is a trade. You exchange memory for speed. You pay with storage space and get back time. This trade only makes sense under three specific conditions — the function must always return the same output for the same input, the calculation must be expensive enough to justify caching overhead, and the same inputs must appear frequently enough to generate cache hits. When all three are true, memoization can turn an unusable function into an instant one. When any one is false, memoization either returns wrong results, wastes memory, or slows things down.

What memoization actually is
Memoization is an optimization technique that caches the return value of a function based on its input arguments.

Memoization is only valid for pure functions — functions that always return the same output for the same input and produce no side effects. A function that reads from a database, generates random numbers, or depends on the current timestamp cannot be safely memoized because the same input could produce different results at different times.

Memoization is a performance optimization technique that trades memory for speed. It works by caching the return values of a function based on its input arguments. If the function is called again with the exact same inputs, we bypass the execution entirely and return the cached result instantly."

Crucial Interview Flex: Proactively mention that this only works for pure functions—functions that always return the exact same output for a given input and have no external side effects.

The JSON.stringify Trap
Mention that JSON.stringify isn't perfect for cache keys because:

Object Property Order: {a:1, b:2} and {b:2, a:1} produce different strings but are identical objects.

Data Loss: It completely drops Functions and Symbols.

Errors: It will throw an error on circular references.

Why this works :

The Cache: The cache object lives safely inside the outer memoize function.

The Closure: Because the returned inner function still has access to that cache variable even after memoize has finished running, the data persists between multiple function calls.

The Trade: If the arg exists as a key in our object, we immediately return it—trading a tiny bit of memory to skip the computation time.

what is pure/impure function:

1. Same Input -- Same OutputEvery single time you call the function with the exact same arguments, it must return the exact same result. It cannot rely on any external state that might change.Pure: (x, y) => x + y (Passing 2 and 3 will always result in 5).Impure: () => Date.now() or () => Math.random() (The result changes every time you call it).2. Zero Side EffectsThe function must not modify anything outside of its own body. It shouldn't change global variables, modify its input arguments, alter the DOM, or make network requests. It simply takes data in, computes, and spits data out.Pure: Spits out a calculated value.Impure: Changing a variable outside the function, logging to the console, or modifying a database.
