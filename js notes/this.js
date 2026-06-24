"use strict";

const obj = {
  name: "Alice",
  method() {
    console.log(this);
  },
};

// 1. Direct Invocation
obj.method(); // Output: { name: "Alice", method: [Function] }

// 2. Indirect Invocation (The Comma Operator)
(0, obj.method)(); // Output: undefined

// Assigning the method to a variable detaches it from the object. When called as a plain function, this is undefined — not person.

const person = {
  name: "Alice",
  greet() {
    console.log("Hello, " + this.name);
  },
};

const greet = person.greet;
greet();

// ans :
const person = {
  name: "Alice",
  greet() {
    console.log("Hello, " + this.name);
  },
};

const greet = person.greet.bind(person);
greet();

const greet = () => person.greet();
greet(); // Output: Hello, Alice

2; // Arrow functions inherit this from the enclosing lexical scope. At the module level this is undefined — not obj.
const obj = {
  name: "JSPrep",
  greet: () => console.log("Hi from " + (this && this.name)),
};

obj.greet(); // Output: Hi from undefined

// Fix: To fix an arrow function inside an object literal so that this points to the object itself, you must change it to a regular function.
// This allows the Implicit Binding rule to kick in at the call site (obj.greet()).
const obj = {
  name: "JSPrep",
  greet() {
    console.log("Hi from " + (this && this.name));
  },
};

obj.greet(); // Output: Hi from JSPrep

// 3: Regular function callbacks lose their this context. Inside the setTimeout, this is undefined — not counter.

const counter = {
  value: 42,
  logAfterDelay() {
    setTimeout(function () {
      console.log(this && this.value);
    }, 0);
  },
};

counter.logAfterDelay(); // Output: undefined

// Fix: When you execute counter.logAfterDelay(), the engine runs the method correctly. However, inside that method,
// you pass a traditional anonymous function into setTimeout.
// When the timer fires, the JavaScript runtime executes that anonymous function as a plain function call (Default Binding).
// Because it's a plain call,
// this loses its connection to the counter object and falls back to undefined (in strict mode) or the global window object.
const counter = {
  value: 42,
  logAfterDelay() {
    setTimeout(() => {
      console.log(this && this.value);
    }, 0);
  },
};

counter.logAfterDelay(); // Output: 42

// Fix 2: Explicit Binding via .bind() You can explicitly bind the inner anonymous function to the current this context before passing it
// to setTimeout.
const counter = {
  value: 42,
  logAfterDelay() {
    setTimeout(
      function () {
        console.log(this && this.value);
      }.bind(this),
      0,
    ); // Hard-binds 'this' (which is counter) to the callback
  },
};

counter.logAfterDelay(); // Output: 42

// 4 : Bug bind permanently fixes this. .call(bob) cannot override a bound function — it still runs with alice as this.
function getName() {
  console.log(this.name);
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

const boundAlice = getName.bind(alice);
boundAlice();
boundAlice.call(bob);

// Fix : Because the function was already hard-bound to alice via getName.bind(alice),
// the context cannot be changed or overridden by calling .call(bob). The bind is permanent.
// If you want getName to dynamically react to different contexts using .call(),
// you must avoid binding it beforehand and invoke .call() directly on the original function.
// The Correct Approach for Dynamic Context

function getName() {
  console.log(this.name);
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

// Call the original function directly with different contexts
getName.call(alice); // Output: "Alice" (Explicit binding)
getName.call(bob); // Output: "Bob"   (Explicit binding)

//  call vs apply — same result, different syntax
function greet(greeting) {
  return greeting + ", " + this.name + "!";
}
const user = { name: "Bob" };
console.log(greet.call(user, "Hello"));
console.log(greet.apply(user, ["Hi"]));

// Method chaining with this
// When a method returns this, it allows for chaining multiple method calls together on the same object.
// Each method call operates on the same instance, enabling a fluent interface style of programming.
class Builder {
  constructor() {
    this.parts = [];
  }
  add(part) {
    this.parts.push(part);
    return this;
  }
  build() {
    return this.parts.join(" + ");
  }
}
console.log(new Builder().add("A").add("B").add("C").build());

//  this in nested object — direct parent wins
// In this example, outer.inner.greet() correctly returns "inner" because
// the this context is determined by the direct parent object (inner) of the greet method.
//  The outer object does not affect the this context of the greet method when it is called through inner.

const outer = {
  name: "outer",
  inner: {
    name: "inner",
    greet() {
      return this.name;
    },
  },
};
console.log(outer.inner.greet());
const fn = outer.inner.greet; // fn is a reference to the greet function, but when called as a plain function, this is undefined — not outer or inner.
console.log(fn?.call(outer)); // Output: "outer" — explicitly set this to outer
console.log(fn?.call(outer.inner)); // Output: "inner" — explicitly set this to inner

// Bind with partial application — pre-filling arguments

function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);
console.log(double(5)); // Output: 10 — 2 is pre-filled as the first argument
console.log(triple(4)); // Output: 12 — 3 is pre-filled as the first argument
console.log(double(triple(2))); // Output: 12 — triple(2) returns 6, then double(6) returns 12

// new vs plain call — new sets this to the new object, ignoring any explicit binding
function Person(name) {
  this.name = name;
}
const p1 = new Person("Alice");
const p2 = Person.call({}, "Bob");
console.log(p1.name); // Output: "Alice" — new creates a new object and sets this to it

console.log(p2); // Output: undefined — Person called as a plain function, this is set to the empty object {},
                //  but since Person doesn't return anything, p2 is undefined



// Interview rule: 
// ask "How was the function called?" 
// Default → standalone call. 
// Implicit → object.method(). 
// Explicit → call/apply/bind. 
// new → constructor. 
// Arrow → look where it was DEFINED.


// 1. Default binding — standalone function call
function fn() { console.log(this); }
fn(); // global object (window) in sloppy mode, undefined in strict

// 2. Implicit binding — method call (object before the dot)
const obj = { name: 'Alice', fn() { return this.name; } };
obj.fn(); // 'Alice' — this = obj


// ⚠️ Implicit binding LOST on assignment
const fn2 = obj.fn;
fn2(); // undefined — no object before dot


// 3. Explicit binding — call, apply, bind
function greet(greeting) { return ${greeting}, ${this.name}; }
greet.call({ name: 'Bob' }, 'Hello');    // 'Hello, Bob'
greet.apply({ name: 'Carol' }, ['Hi']); // 'Hi, Carol'
const bound = greet.bind({ name: 'Dave' });
bound('Hey'); // 'Hey, Dave' — permanently bound


// 4. new binding — constructor call
function Person(name) { this.name = name; }
const p = new Person('Eve');
p.name; // 'Eve' — this = freshly created object


// new: 1) creates {} 2) links prototype 3) binds this 4) returns it


// Arrow functions: LEXICAL this — none of the 4 rules apply
const obj2 = {
  name: 'Zara',
  fn: () => this.name, // this = outer scope (NOT obj2)
  method() { return () => this.name; } // nested arrow captures method's this
};
obj2.fn();            // undefined — arrow ignores implicit binding
obj2.method()();      // 'Zara' — arrow captured method's this