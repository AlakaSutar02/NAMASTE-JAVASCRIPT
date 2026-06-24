function TodoList() {}
TodoList.prototype.items = [];

const list1 = new TodoList();
const list2 = new TodoList();

list1.items.push("Buy milk");
console.log(list1.items.length);
console.log(list2.items.length);

function TodoList() {
  // Fix: Every time 'new TodoList()' is called, a brand new array is created
  this.items = [];
}

Fix;
// Methods are still safely shared on the prototype
TodoList.prototype.addItem = function (item) {
  this.items.push(item);
};

const list1 = new TodoList();
const list2 = new TodoList();

list1.addItem("Buy milk");

console.log(list1.items.length); // 1
console.log(list2.items.length); // 0 (Perfect! Safe and isolated)

// "Properties intended to hold unique state—especially reference types like Arrays and Objects—should always be initialized inside
// the constructor function.
// The prototype should strictly be reserved for shared methods and primitive constants."

function manualNew(Constructor, ...args) {
  // Step 1 & 2: Create a blank object {} and link its fallback to the prototype
  const instance = Object.create(Constructor.prototype);

  // Step 3: Run the constructor function, forcing 'this' to be our new object
  const result = Constructor.apply(instance, args);

  // Step 4: Return the object (guarding against constructors returning custom objects)
  return typeof result === "object" && result !== null ? result : instance;
}

// Let's create an instance using our custom tool
const alex = manualNew(User, "Alex");
console.log(alex.login()); // "Alex logged in!"
