The Mental Model
Picture a coffee machine that takes all your instructions at once — size, strength, milk, sugar — and makes your coffee in one shot. Now picture a barista who takes one instruction at a time. You say "large." They nod, remember it. You say "strong." They nod, remember it. You say "oat milk." They start making it. The barista approach is currying. Currying transforms a function that takes multiple arguments all at once into a chain of functions that each take one argument and return the next function in the chain — until all arguments have been collected and the final result is produced. The key insight: currying is about transforming how you call a function, not what it does. add(2, 3) and add(2)(3) produce the same result — 5 — but the curried form lets you pre-configure the function partially, save that partial application, and reuse it with different final arguments. That reusability is the entire point.

The Explanation
What currying looks like
// Regular function — takes all arguments at once
function add(a, b) {
return a + b
}
add(2, 3) // 5

// Curried version — takes one argument at a time
function curriedAdd(a) {
return function(b) {
return a + b
}
}

curriedAdd(2)(3) // 5
const add2 = curriedAdd(2) // partially applied — 'a' is locked in as 2
add2(3) // 5
add2(10) // 12
add2(100) // 102
With arrow functions, curried functions become extremely compact:

const add = a => b => a + b
const multiply = a => b => a \* b
const greet = greeting => name => `${greeting}, ${name}!`

add(5)(3) // 8
const add5 = add(5)
add5(3) // 8
add5(10) // 15

greet('Hello')('Alice') // 'Hello, Alice!'
const sayHello = greet('Hello')
sayHello('Alice') // 'Hello, Alice!'
sayHello('Bob') // 'Hello, Bob!'
Partial application — the practical payoff
Partial application means calling a curried function with only some of its arguments, getting back a specialized function. This is where currying earns its place in real codebases.

// A generic validator function
const validate = (min) => (max) => (value) => value >= min && value <= max

const isValidAge = validate(0)(120) // specialized: 0-120
const isValidScore = validate(0)(100) // specialized: 0-100
const isAdult = validate(18)(120) // specialized: 18+

isValidAge(25) // true
isValidAge(150) // false
isValidScore(85) // true
isAdult(16) // false

// A curried API call helper
const fetchFrom = (baseUrl) => (endpoint) => (id) =>
fetch(`${baseUrl}${endpoint}/${id}`).then(r => r.json())

const fetchFromAPI = fetchFrom('https://api.example.com')
const fetchUsers = fetchFromAPI('/users')
const fetchProducts = fetchFromAPI('/products')

fetchUsers(123) // GET https://api.example.com/users/123
fetchProducts(456) // GET https://api.example.com/products/456
Building a curry() utility function
A general-purpose curry() function automatically converts any multi-argument function into a curried one:

function curry(fn) {
return function curried(...args) {
// If we've collected enough arguments, call the original function
if (args.length >= fn.length) {
return fn.apply(this, args)
}
// Otherwise, return a function that collects more arguments
return function(...moreArgs) {
return curried.apply(this, args.concat(moreArgs))
}
}
}

// Using curry()
function add(a, b, c) {
return a + b + c
}

const curriedAdd = curry(add)

curriedAdd(1)(2)(3) // 6 — one at a time
curriedAdd(1, 2)(3) // 6 — two then one
curriedAdd(1)(2, 3) // 6 — one then two
curriedAdd(1, 2, 3) // 6 — all at once (still works)
Currying vs partial application — the distinction
These terms are often used interchangeably but are technically different:

// Currying: a function that ALWAYS takes ONE argument and returns
// a function until all arguments are collected
const curriedAdd = a => b => c => a + b + c
curriedAdd(1) // function waiting for b
curriedAdd(1)(2) // function waiting for c
curriedAdd(1)(2)(3) // 6

// Partial application: fixing SOME (not necessarily one) arguments
// ahead of time and getting back a function for the rest
function partialAdd(a, b) {
return function(c) {
return a + b + c
}
}
const add1and2 = partialAdd(1, 2) // fixed 2 args at once
add1and2(3) // 6

// JavaScript's .bind() is built-in partial application
function add(a, b, c) { return a + b + c }
const add5 = add.bind(null, 5) // pre-fills a=5
add5(2, 3) // 10 — b=2, c=3
Currying with array methods — functional composition
// Curried helper functions compose naturally with map/filter/reduce
const multiply = a => b => a \* b
const isOver = n => x => x > n
const hasProperty = key => obj => key in obj

const numbers = [1, 2, 3, 4, 5]
const users = [
{ name: 'Alice', age: 25, active: true },
{ name: 'Bob', age: 17, active: false },
{ name: 'Carol', age: 32, active: true },
]

// These read like plain English:
numbers.map(multiply(3)) // [3, 6, 9, 12, 15]
numbers.filter(isOver(3)) // [4, 5]
users.filter(hasProperty('active')) // all three
users.map(u => u.name) // ['Alice', 'Bob', 'Carol']

// Combining multiple curried transforms:
const getActiveSeniorNames = users =>
users
.filter(isOver(18)(\_.get('age'))) // illustrative — use real impl
.filter(hasProperty('active'))
.map(u => u.name)
Currying in function composition (pipe / compose)
// Function composition uses currying to build data pipelines
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const process = pipe(
x => x \* 2,
x => x + 1,
x => x.toString(),
x => `Result: ${x}`
)

process(5) // 'Result: 11'
// 5 → 10 → 11 → '11' → 'Result: 11'

// Real-world: processing API response
const processUser = pipe(
user => ({ ...user, name: user.name.trim() }),
user => ({ ...user, email: user.email.toLowerCase() }),
user => ({ ...user, createdAt: new Date(user.createdAt) }),
)
Arity — why it matters for currying
Arity is the number of parameters a function expects. fn.length returns it. Currying relies on knowing the arity to know when enough arguments have been collected:

const add = (a, b, c) => a + b + c
add.length // 3

// Rest parameters break arity detection:
const sum = (...args) => args.reduce((a, b) => a + b, 0)
sum.length // 0 — rest parameters don't count

// Default parameters also:
const greet = (name, greeting = 'Hello') => `${greeting}, ${name}`
greet.length // 1 — only counts parameters before the first default
Common Misconceptions
⚠️
Many devs think currying and partial application are the same thing — but actually currying strictly means transforming a function into a chain where each function takes exactly one argument. Partial application means pre-filling some arguments and returning a function for the rest. The two overlap but are technically distinct. JavaScript's .bind() does partial application, not currying.

⚠️
Many devs think currying is primarily a performance optimization — but actually currying is about code reuse and composability. The performance is identical or negligibly worse. The value is being able to create specialized functions from general ones (add(5) as a reusable "add five to anything" function) and compose them into pipelines.

⚠️
Many devs think curried functions must always be called one argument at a time — but actually a well-implemented curry() utility (like Lodash's \_.curry) accepts multiple arguments at any call and only waits for more when the total count is below the expected arity. curriedAdd(1, 2)(3) and curriedAdd(1)(2)(3) both work.

⚠️
Many devs think currying requires a special utility function to implement — but actually manual currying with nested arrow functions (const add = a => b => a + b) is pure JavaScript and needs no library. The curry() utility just automates the nesting for existing multi-argument functions.

⚠️
Many devs think currying is only theoretical or academic — but actually React's higher-order components, Redux's connect(), middleware patterns (Redux middleware is explicitly triple-curried: store => next => action => {}), and Lodash's functional module all use currying as a primary design tool.

⚠️
Many devs confuse function.length with the number of arguments passed — but actually function.length is the number of parameters declared (arity), while arguments.length is the number of arguments passed in a call. Rest parameters and default parameters do not count toward function.length.

Where You'll See This in Real Code
→
Redux middleware is the most famous real-world curried function — const middleware = store => next => action => {} is triple-curried by design. Redux calls it once with store, once with next, and then your middleware receives actions. This lets the Redux store compose multiple middleware functions without each one knowing about the others.

→
Lodash's functional programming module (lodash/fp) automatically curries all its functions and fixes argument order — _.map(iteratee)(collection) instead of _.map(collection, iteratee). This argument reversal plus auto-currying enables point-free function composition with pipe and compose.

→
React's higher-order components are partial application — connect(mapStateToProps, mapDispatchToProps) returns a function that takes a component. The connect function is curried so you can define the Redux wiring once and reuse it with multiple components: const withAuth = withAuthCheck(config); const ProtectedPage = withAuth(Page).

→
CSS-in-JS libraries like styled-components use currying internally — styled.div is a function returning a function, where the first call configures the element type and the second call (the template literal tag) provides the styles.

→
Event handler factories in large React applications use currying to avoid inline arrow functions — const handleChange = field => event => dispatch(updateField(field, event.target.value)) lets you write onChange={handleChange('email')} in JSX without creating a new function on every render.

→
Internationalization libraries use curried translation functions — const t = locale => key => translations[locale][key] — so you can create a locale-specific translate function once (const translate = t('en')) and call it many times without repeating the locale.

⚡
Interview Cheat Sheet
✦
Currying: transforms f(a,b,c) into f(a)(b)(c) — chain of single-argument functions
✦
Partial application: pre-filling some arguments, returning a function for the rest
✦
JavaScript .bind(ctx, arg1, arg2) = built-in partial application
✦
Arrow currying: const add = a => b => a + b — compact and idiomatic
✦
curry() utility: collects args until fn.length is satisfied, then calls the original
✦
fn.length = declared parameter count (arity); rest params and defaults don't count
✦
Main benefit: reusable specialized functions, composable pipelines
✦
Redux middleware = canonical real-world triple-curried function
💡
How to Answer in an Interview

1.  Build up from scratch: regular fn → manual curried → general curry() utility — shows you understand the concept before the pattern
2.  The partial application distinction earns you points — most devs confuse the terms
3.  Redux middleware as the real-world example is instantly recognizable to every React developer
4.  Connecting currying to function composition (pipe/compose) shows you understand the broader functional programming context
5.  fn.length vs arguments.length is a great detail that shows spec-level knowledge
