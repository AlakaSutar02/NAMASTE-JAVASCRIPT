## 📖 Episode 1: Execution Context

📌 **Execution Context in JavaScript**

In JavaScript, everything runs inside an **Execution Context**. Think of it as a sealed-off container where your code is evaluated and executed. It holds information about the environment in which the current code is running.

### Components:

1. **Memory Component (Variable Environment)**

   * Stores variables and function declarations as key-value pairs
   * Known as the *Creation Phase*

2. **Code Component (Thread of Execution)**

   * Executes the code line-by-line
   * Known as the *Execution Phase*

### 🔁 JavaScript Execution Characteristics

* **Synchronous**: Executes code in the order it appears (line-by-line)
* **Single-threaded**: Only one command is processed at a time using a single call stack

