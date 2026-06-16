// index.test.js
const once = require("./once-func");

describe("once function", () => {
  test("calls the function only once and returns the cached result", () => {
    const mockFn = jest.fn((a, b) => a + b);
    const onceAdd = once(mockFn);

    expect(onceAdd(2, 3)).toBe(5);
    expect(onceAdd(4, 5)).toBe(5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("works with functions that take no arguments", () => {
    const mockFn = jest.fn(() => "Hello!");
    const onceGreet = once(mockFn);

    expect(onceGreet()).toBe("Hello!");
    expect(onceGreet()).toBe("Hello!");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("does not cache error if first call throws", () => {
    let count = 0;
    const sometimesThrows = jest.fn(() => {
      if (count === 0) {
        count++;
        throw new Error("Oops!");
      }
      return "Success";
    });

    const onceThrow = once(sometimesThrows);

    expect(() => onceThrow()).toThrow("Oops!");
    expect(onceThrow()).toBe("Success");
    expect(onceThrow()).toBe("Success");
  });
});
