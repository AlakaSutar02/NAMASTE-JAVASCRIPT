### In JavaScript, functions are objects. Because they are objects, they come with built-in methods designed to help you control the execution context—specifically, what the this keyword points to.

### call, apply, and bind all exist to solve the exact same problem: **explicitly setting the this context for a function. However, they differ in how they accept arguments and when they execute the function.**

## 1. call(): Invoke Immediately (Comma-Separated Arguments)

### call() invokes the function immediately. You pass the desired this context as the first argument, and any parameters the function needs as individual, comma-separated arguments.

```
const user1 = { name: "Alka" };
const user2 = { name: "Rahul" };

function greet(greeting, punctuation) {
    console.log(`${greeting}, my name is ${this.name}${punctuation}`);
}

// Pass the context, then the arguments one by one
greet.call(user1, "Hello", "!"); // Output: "Hello, my name is Alka!"
greet.call(user2, "Hey", ".");   // Output: "Hey, my name is Rahul."

```

## 2. apply(): Invoke Immediately (Array of Arguments)

### apply() behaves exactly like call() and invokes the function immediately. The only difference is syntax: instead of passing arguments one by one, you pass them wrapped in a single array.

```

const user1 = { name: "Alka" };
const user2 = { name: "Rahul" };

function greet(greeting, punctuation) {
    console.log(`${greeting}, my name is ${this.name}${punctuation}`);
}

// Pass the context, then all arguments inside an array []
greet.apply(user1, ["Hello", "!"]); // Output: "Hello, my name is Alka!"
greet.apply(user2, ["Hey", "."]);   // Output: "Hey, my name is Rahul."

```

## 3. bind(): Save for Later (Returns a Brand New Function)

### Unlike call and apply, bind() does not execute the function right away. Instead, it changes the context permanently and returns a copy of that function that you can store in a variable and run whenever you want in the future.

```
const user3 = { name: "Sneha" };

function introduce(hobby) {
    console.log(`Hi, I'm ${this.name} and I love ${hobby}.`);
}

// bind() returns a brand new function with 'this' locked onto user3
const introduceSneha = introduce.bind(user3);

// You can call it later, passing arguments normally!
introduceSneha("coding"); // Output: "Hi, I'm Sneha and I love coding."
introduceSneha("gaming"); // Output: "Hi, I'm Sneha and I love gaming."
```

## JavaScript Context Methods: call(), apply(), and bind()

| Method      | Invokes Immediately? | Argument Format                      | Common Use Case                                                           |
| :---------- | :------------------: | :----------------------------------- | :------------------------------------------------------------------------ |
| **`call`**  |        ✅ Yes        | Comma-separated (`ctx, arg1, arg2`)  | Standard borrowing of methods from other objects.                         |
| **`apply`** |        ✅ Yes        | Array (`ctx, [arg1, arg2]`)          | When arguments are already dynamic or stored in an array.                 |
| **`bind`**  |        ❌ No         | Can pass during binding or execution | Event listeners, `setTimeout`, or preserving context for async callbacks. |
