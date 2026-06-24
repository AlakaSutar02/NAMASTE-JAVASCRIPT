The Explanation
The four components of the event loop
Call Stack — LIFO stack of execution contexts. Each function call pushes a frame; return pops it. When the stack is empty, the engine is idle and the event loop picks the next task.
Web APIs (Browser Host Environment) — the browser's parallel capabilities outside the JS thread: setTimeout, fetch, addEventListener, requestAnimationFrame. When they complete, they push callbacks into the appropriate queue.
Macrotask Queue (Task Queue) — FIFO queue. The event loop picks ONE macrotask per cycle. What goes here: setTimeout, setInterval, setImmediate (Node), I/O callbacks, postMessage, MessageChannel.
Microtask Queue (Job Queue) — higher priority. FULLY DRAINED after every task before the next macrotask. What goes here: Promise.then/catch/finally, queueMicrotask(), MutationObserver, async/await continuations.
The event loop algorithm — exactly, step by step
Execute the oldest task from the macrotask queue (or the initial script on page load)
After the task finishes (call stack empty): drain the entire microtask queue
Execute each microtask in order
If a microtask queues another microtask — execute it immediately (still in this drain)
Keep going until the microtask queue is completely empty
Browser only: if a rendering frame is due (~every 16.67ms at 60fps), run requestAnimationFrame callbacks, then paint/composite the frame
Return to step 1 — pick the next macrotask
What goes where — the complete classification table
API / Method Queue Environment
Promise.then / .catch / .finally Microtask Browser + Node
async/await (code after await) Microtask Browser + Node
queueMicrotask() Microtask Browser + Node
MutationObserver Microtask Browser only
setTimeout(fn, delay) Macrotask Browser + Node
setInterval(fn, delay) Macrotask Browser + Node
setImmediate(fn) Macrotask Node only
I/O callbacks (fs.readFile, etc.) Macrotask Node (poll phase)
postMessage / MessageChannel Macrotask Browser
requestAnimationFrame Animation Frame Browser only
process.nextTick nextTick Node only
The fundamental rule — microtasks always win over macrotasks
console.log('1 — sync')

setTimeout(() => console.log('2 — setTimeout'), 0)

Promise.resolve()
.then(() => console.log('3 — promise 1'))
.then(() => console.log('4 — promise 2'))

console.log('5 — sync')

// Output:
// 1 — sync
// 5 — sync
// 3 — promise 1 ← microtask, drains before setTimeout
// 4 — promise 2 ← microtask queued by promise 1
// 2 — setTimeout ← macrotask, last
Step-by-step trace:

Script starts (first macrotask). Call stack: [main script]
'1 — sync' logs → pops
setTimeout → Web API registers 0ms timer → callback queued to macrotask queue
Promise.resolve() already resolved → .then('promise 1') queued to microtask queue
'5 — sync' logs → pops. Script ends. Call stack empty.
Drain microtasks: 'promise 1' runs → .then('promise 2') queued → 'promise 2' runs → microtask queue empty
Pick next macrotask: setTimeout callback → '2 — setTimeout'
Chained .then — understanding multi-tick microtask ordering
// Critical: returning a Promise from .then adds 2 extra microtask ticks
Promise.resolve()
.then(() => {
console.log('A')
return Promise.resolve('B') // returning a PROMISE from .then
})
.then((v) => console.log(v)) // delayed by 2 extra ticks

Promise.resolve()
.then(() => console.log('C'))
.then(() => console.log('D'))

// Output: A, C, D, B
When a .then callback returns a plain value, the next .then is queued immediately (1 microtask tick). When it returns a Promise, JavaScript must invoke a PromiseResolveThenableJob to unwrap it — adding 2 extra microtask ticks before the next .then fires. This causes A, C, D, B rather than A, B, C, D.

This is a senior-level question asked at Google, Atlassian, and CRED.

async/await — what it compiles to
async function main() {
console.log('A')
await Promise.resolve() // suspends here
console.log('B') // runs as microtask continuation
}

main()
console.log('C')

// Output: A, C, B
await x is approximately Promise.resolve(x).then(restOfFunction). The async function suspends, returns a pending Promise to the caller, and the caller continues synchronously. When the awaited value resolves, the rest of the function is queued as a microtask.

// Multi-await trace
async function a() {
console.log('a1')
await b()
console.log('a2')
}
async function b() {
console.log('b1')
await null
console.log('b2')
}

a()
console.log('sync')

// Output: a1, b1, sync, b2, a2
// a1: sync. b1: sync (b called from a). await null: b suspends → a suspends (b returned pending promise).
// 'sync': runs. Microtask: b resumes → 'b2' → b resolves → a's continuation queued → 'a2'
The hardest event loop question — mixed macro and micro
console.log('1')

setTimeout(() => {
console.log('2')
Promise.resolve().then(() => console.log('3'))
}, 0)

Promise.resolve()
.then(() => {
console.log('4')
setTimeout(() => console.log('5'), 0)
})

setTimeout(() => console.log('6'), 0)

console.log('7')

// Output: 1, 7, 4, 2, 3, 6, 5
Trace:

Sync: '1', register timer-2, queue microtask-4, register timer-6, '7'
Macrotask queue: [timer-2, timer-6]
Microtask: '4' runs → registers timer-5. Macrotask queue now: [timer-2, timer-6, timer-5]
Macrotask: timer-2 → '2' → queues microtask-3
Drain microtasks: '3'
Macrotask: timer-6 → '6'
Macrotask: timer-5 → '5' (added last, runs last)
queueMicrotask — explicit microtask scheduling
console.log('start')

queueMicrotask(() => console.log('microtask'))
setTimeout(() => console.log('timeout'), 0)

console.log('end')

// Output: start, end, microtask, timeout
queueMicrotask() explicitly schedules a microtask without allocating a Promise object — slightly cheaper than Promise.resolve().then(fn). Useful for deferring work until after the current task without yielding to macrotasks.

Starving the macrotask queue — infinite microtask recursion
function flood() {
Promise.resolve().then(flood) // microtask queues another microtask → infinite
}
setTimeout(() => console.log('never runs'), 0)
flood()
// The setTimeout callback NEVER fires
// Microtask queue never empties → macrotask queue never gets picked
This freezes the browser (or hangs the Node process). No user interactions, no renders, no macrotasks — ever. This is why infinite async recursion should use setTimeout to yield:

async function yieldingLoop() {
while (shouldContinue()) {
doWorkChunk()
await new Promise(r => setTimeout(r, 0)) // yield to event loop — allow renders and input
}
}
requestAnimationFrame — the rendering checkpoint
requestAnimationFrame(() => console.log('rAF'))
setTimeout(() => console.log('setTimeout 16ms'), 16)
Promise.resolve().then(() => console.log('promise'))

// Approximate output:
// promise ← microtask, always first
// rAF ← fires before next browser paint (~16.67ms from last frame)
// setTimeout ← macrotask, fires when timer expires
rAF callbacks execute at the start of each browser frame (after microtasks drain, before the frame is painted). They are not macrotasks — they have their own animation frame callback queue. The precise order each frame: macrotask → drain microtasks → rAF callbacks → paint. Using rAF for animations ensures they are synchronised to the display refresh cycle. setTimeout is not synchronised — it causes jank.

The 60fps budget — JavaScript blocks rendering
The browser targets 60 frames per second = one frame every 16.67ms. Within each frame: JavaScript runs → style → layout → paint → composite. If JavaScript alone takes longer than ~10ms, the frame budget is blown and the browser drops a frame. Tasks longer than 50ms are classified as Long Tasks and appear as jank.

// Blocking — 300ms of sync work, page completely frozen
function blockingWork() {
let sum = 0
for (let i = 0; i < 1_000_000_000; i++) sum += i
return sum
}

// Non-blocking — yield every 100k iterations via setTimeout
async function chunkedWork() {
let sum = 0
for (let i = 0; i < 1_000_000_000; i++) {
sum += i
if (i % 100_000 === 0) {
await new Promise(r => setTimeout(r, 0)) // yield to event loop
}
}
return sum
}
setTimeout — delay is a minimum, not a guarantee
const start = Date.now()
setTimeout(() => {
console.log(Date.now() - start + 'ms') // at least 0ms, but usually 1-5ms
}, 0)

// The HTML spec requires a minimum 4ms for nested setTimeout (5+ levels deep)
function nested(n) {
if (n > 8) return
setTimeout(() => {
console.log('depth', n) // depths 1-4: ~0ms. depth 5+: ~4ms minimum per HTML spec
nested(n + 1)
}, 0)
}
nested(1)
setTimeout 0ms fires as fast as the event loop allows — after the current call stack empties and all microtasks drain. If a synchronous function takes 500ms, your setTimeout(fn, 0) fires 500ms+ later.

setInterval drift and the fix
// setInterval accumulates drift — callback execution time delays the next fire
setInterval(() => {
doWork() // if doWork takes 5ms and interval is 10ms, effective interval becomes 15ms
}, 10)

// Drift-compensated pattern using setTimeout
function preciseInterval(fn, interval) {
let expected = Date.now() + interval
function tick() {
const drift = Date.now() - expected
fn()
expected += interval
setTimeout(tick, Math.max(0, interval - drift)) // compensate for drift
}
setTimeout(tick, interval)
}
Promise.all — what actually happens in the event loop
// All three fetches START IMMEDIATELY — they all go to Web APIs concurrently
const p1 = fetch('/api/users') // HTTP request in browser's network layer
const p2 = fetch('/api/posts') // another concurrent HTTP request
const p3 = fetch('/api/comments') // and another

// JavaScript is free while all three are in-flight
const [users, posts, comments] = await Promise.all([p1, p2, p3])
// Total time ≈ max(t1, t2, t3) — not t1+t2+t3
Promise.all does NOT queue promises sequentially. The async operations (fetch calls) all start in the Web API layer simultaneously. JavaScript yields at await. As each response arrives, its resolve callback is queued. When the last one resolves, Promise.all resolves — and the continuation is a microtask.

Sequential vs parallel async — the most costly interview bug
// SEQUENTIAL — each await waits for the previous. Total = t1 + t2 + t3
async function sequential(ids) {
const results = []
for (const id of ids) {
results.push(await fetchUser(id)) // one at a time
}
return results
}

// PARALLEL — all start immediately. Total = max(t1, t2, t3)
async function parallel(ids) {
return Promise.all(ids.map(id => fetchUser(id))) // all at once
}

// If each fetchUser takes 100ms:
// sequential([1,2,3]) → ~300ms
// parallel([1,2,3]) → ~100ms
The sequential pattern in for...of with await is one of the most common performance bugs in production code at Razorpay, Swiggy, and Flipkart. Always use Promise.all when operations are independent.

Node.js event loop — phases (different from browser)
Node's event loop has explicit phases powered by libuv:

timers — setTimeout and setInterval callbacks whose delay has expired
pending callbacks — I/O callbacks deferred from previous iteration
idle, prepare — internal libuv use
poll — retrieve new I/O events; execute their callbacks; block here if nothing is pending
check — setImmediate callbacks
close callbacks — 'close' events (e.g. socket.on('close', ...))
Between every phase, Node drains the microtask queue (Promise.then) AND the nextTick queue (process.nextTick — which fires BEFORE Promise microtasks).

Node.js: process.nextTick vs Promise.then vs setImmediate
console.log('start')

setImmediate(() => console.log('setImmediate'))
setTimeout(() => console.log('setTimeout'), 0)
Promise.resolve().then(() => console.log('Promise'))
process.nextTick(() => console.log('nextTick'))

console.log('end')

// Node.js output:
// start
// end
// nextTick ← nextTick queue fires before Promise microtasks
// Promise ← microtask queue
// setTimeout ← timers phase (may come before setImmediate at top level — non-deterministic)
// setImmediate ← check phase
// Inside an I/O callback: setImmediate ALWAYS before setTimeout
const fs = require('fs')
fs.readFile(\_\_filename, () => {
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
})
// Output: immediate, timeout (guaranteed inside I/O callback)
// Because: we're in poll phase, next phase is check (setImmediate), then timers
Web Workers — truly parallel event loops
// Main thread
const worker = new Worker('worker.js')
worker.postMessage({ nums: largeArray }) // sends to worker's separate event loop
worker.onmessage = (e) => {
console.log('result:', e.data) // receives when worker posts back
}

// worker.js — completely separate event loop, no DOM, no shared memory (except SharedArrayBuffer)
self.onmessage = (e) => {
const result = heavyCPUWork(e.data.nums) // doesn't block main thread
self.postMessage(result) // queues a macrotask in main thread's macrotask queue
}
Workers have their own call stack, event loop, and memory. They cannot access the DOM. Communication via postMessage creates a macrotask on the receiving side. This is the only way to perform CPU-intensive work without blocking the main thread.

Common Misconceptions
⚠️
Many developers think JavaScript is asynchronous — but JavaScript itself is synchronous and single-threaded. What's asynchronous is the browser's Web API environment (timers, fetch, events). JavaScript just processes the callbacks that those APIs push into queues after their work completes.

⚠️
Many developers think setTimeout(fn, 0) runs immediately after the current function — but it queues the callback as a macrotask. It only runs after the current task finishes AND all pending microtasks drain. Promise.then always fires before setTimeout(fn, 0), even though both are "deferred".

⚠️
Many developers think each .then callback is a separate event loop cycle — but multiple chained .then callbacks are all microtasks that drain in sequence during a single event loop cycle's microtask drain phase. The event loop doesn't go through a new full cycle between .then calls.

⚠️
Many developers think async/await runs code in parallel — but await suspends the current function and queues a microtask continuation. Two sequential awaits are sequential, not parallel. The async operation itself (fetch) may be parallel in Web APIs — but the JavaScript code is single-threaded throughout.

⚠️
Many developers think returning a Promise from .then is the same as returning a plain value — but returning a Promise from inside .then adds two extra microtask ticks due to internal PromiseResolveThenableJob processing. This is why chained .then chains can interleave in unexpected order.

⚠️
Many developers think requestAnimationFrame is just a timer with a 16ms interval — but rAF fires before the browser paints, synchronised to the display refresh cycle. setTimeout(fn, 16) is not synchronised to rendering — it causes jank. rAF fires ONCE per frame; the browser may drop frames under load, but rAF callbacks always run before paint.

⚠️
Many developers think blocking async functions only affects that function — but any long synchronous execution blocks the entire JavaScript thread. Async/await does not make CPU-intensive code non-blocking. Only yielding (setTimeout, Worker threads) truly releases the thread.

⚠️
Many developers think Promise.all runs its promises in sequence — but Promise.all starts all promises simultaneously. The async operations all begin in the Web API layer at once. Total time is the maximum, not the sum. The common bug: sequential awaits in a for...of loop where Promise.all would be 3x faster.

⚠️
Many developers think microtask starvation is a theoretical problem — but it happens when you accidentally create an infinite Promise chain in production code. An unintentional Promise.resolve().then(fn) inside fn creates an infinite microtask loop that freezes the page silently.

⚠️
Many developers think Node.js and browser event loops are identical — but Node has explicit phases (timers, poll, check, close) and process.nextTick which fires before even Promise microtasks. Inside an I/O callback, setImmediate is deterministically before setTimeout. These differences matter for server code.

Where You'll See This in Real Code
→
React's state batching in React 18 is built on the event loop — multiple setState calls inside a single event handler are batched into one re-render because React defers the render to a microtask or a scheduled macrotask, collecting all synchronous state changes first before triggering one render pass.

→
Node.js's non-blocking I/O model — the reason it handles thousands of concurrent connections on a single thread — is entirely the event loop in action. File reads, database queries, and network calls all register callbacks that re-enter the thread via the macrotask queue when ready, while the thread stays free for other work.

→
Long tasks (JavaScript functions that run for more than 50ms) are detected by Lighthouse and Chrome DevTools as blocking the main thread. Each long task prevents the browser from processing user input, running animations, and rendering, because the call stack doesn't empty until the task finishes. The fix is breaking the work into smaller chunks with setTimeout or scheduler.postTask().

→
Debounce and throttle implementations are direct event loop tools — debounce uses setTimeout to push work into a future macrotask, allowing many rapid events to cancel and reschedule each other. The final callback only fires once the event stream pauses long enough for the timer to complete without being cancelled.

→
Promises in the fetch API chain are microtasks all the way down — every .then() in a fetch().then().then().then() chain schedules the next step as a microtask. This means a deeply chained Promise chain processes all its steps before any setTimeout or I/O callback runs, which is why Promise chains respond faster than equivalent timer-based patterns.

→
Web Workers run JavaScript on a separate thread and communicate back to the main thread via message events, which enter the macrotask queue. The main thread's event loop picks them up normally. This is the only way to run JavaScript truly in parallel — the worker has its own event loop, its own call stack, and its own queues.

⚡
Interview Cheat Sheet
✦
Call stack: LIFO, one execution context at a time. Empty stack = event loop picks next task
✦
Microtask queue: Promise.then, queueMicrotask, MutationObserver, async/await continuations
✦
Macrotask queue: setTimeout, setInterval, setImmediate (Node), I/O callbacks, postMessage
✦
THE RULE: after every macrotask, drain ALL microtasks before picking the next macrotask
✦
Promise.then fires BEFORE setTimeout even if setTimeout delay is 0
✦
A microtask can queue another microtask — all drain before any macrotask runs
✦
Infinite microtask recursion (Promise.resolve().then(self)) starves macrotasks — page freezes
✦
requestAnimationFrame: fires before paint, synchronized to display (~16.67ms), not a macrotask
✦
setTimeout delay is a MINIMUM — actual fire = after call stack empties + all microtasks drain
✦
HTML spec: nested setTimeout 5+ levels deep has a 4ms minimum delay
✦
async/await: code after await is a microtask continuation (equivalent to .then callback)
✦
Returning Promise from .then = 2 extra microtask ticks. Returning plain value = 1 tick.
✦
Promise.all: starts ALL promises simultaneously. Total time = max, not sum.
✦
Sequential await in for...of = sequential (slow). Promise.all(arr.map(...)) = parallel (fast)
✦
Long tasks (>50ms of sync work) block rendering, input, and all other callbacks
✦
Break long work into chunks: await new Promise(r => setTimeout(r, 0)) yields to event loop
✦
Web Workers: separate event loop and memory. postMessage queues macrotask on receiving side.
✦
Node: process.nextTick fires BEFORE Promise microtasks (highest-priority deferred in Node)
✦
Node: inside I/O callback, setImmediate always before setTimeout (deterministic)
✦
Node event loop phases in order: timers → pending I/O → idle → poll → check → close callbacks
💡
How to Answer in an Interview

1.  The output-prediction question (setTimeout + Promise + sync) is the most common event loop interview question — practice until you can trace it without paper
2.  Always mention the microtask queue drains completely — that's the detail most devs get wrong
3.  The async/await = microtask resumption explanation elevates you above candidates who just say "it's async"
4.  Draw the event loop diagram — it immediately signals deep understanding
5.  Node.js's process.nextTick is the surprise fact that impresses senior interviewers — most frontend devs don't know it exists
6.  Connecting to React 18 batching, Node.js I/O, and web workers shows you understand why this matters beyond interview trivia
7.  Draw the diagram: call stack on left, microtask queue in middle, macrotask queue on right, event loop arrow connecting them — it makes your explanation instantly clearer
