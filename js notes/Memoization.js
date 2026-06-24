function memoise(fn) {
  const cache = {};

  return function (arg) {
    if (arg in cache) {
      console.log("Fetching from cache");
      return cache[arg];
    }

    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
}
const double = (x) => x * 2;
const memoisedDouble = memoise(double);

console.log(memoisedDouble(5)); // calculated
console.log(memoisedDouble(5)); // cached
console.log(memoisedDouble(10)); // calculated
console.log(memoisedDouble(10)); // cached
