class Stack {
  constructor() {
    // Initialize your stack using an empty array
    this.items = [];
  }

  push(element) {
    // Add element to the top and return the new size of the stack
    this.items.push(element);
    return this.items.length;
  }

  pop() {
    // Remove and return top element. Returns undefined if the stack is empty.
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.pop();
  }

  peek() {
    // Return top element without removing it. Returns undefined if empty.
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // Check if stack is empty
    return this.items.length === 0;
  }

  size() {
    // Return number of elements
    return this.items.length;
  }

  clear() {
    // Remove all elements to ensure proper memory management
    this.items = [];
  }
}

module.exports = Stack;
