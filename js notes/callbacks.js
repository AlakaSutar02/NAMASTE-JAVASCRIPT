// Synchronous callback — called immediately, inline
function doTwice(fn) {
  fn();
  fn();
}
doTwice(() => console.log("hello")); // 'hello', 'hello'

// Event-driven callback — called when the event fires
document.addEventListener("click", (event) => {
  console.log("clicked at", event.clientX, event.clientY);
});

// Async callback — called when the async work completes
setTimeout(() => {
  console.log("1 second has passed");
}, 1000);

// All three are the same concept — a function given to another function to call

//*************************************************************************************************

// Synchronous callback — runs BEFORE the next line
const doubled = [1, 2, 3].map((n) => n * 2);
console.log(doubled); // [2, 4, 6] — map's callback ran first, synchronously

// Asynchronous callback — runs AFTER the current call stack clears
setTimeout(() => console.log("async"), 0);
console.log("sync");
// Output: 'sync', 'async'
// Even with 0ms delay, setTimeout's callback is a macrotask — runs after sync code

// This inconsistency is a common bug source:
function getUserData(id, callback) {
  if (cache[id]) {
    callback(cache[id]); // synchronous if cached
  } else {
    fetch(`/api/${id}`)
      .then((r) => r.json())
      .then(callback); // asynchronous if not cached
  }
}
// Callers can't know if their callback fires sync or async — unpredictable!

//*************************************************************************************************

// ❌ The Pyramid of Doom
getUser(userId, (err, user) => {
  if (err) return handleError(err);

  getProfile(user.profileId, (err, profile) => {
    if (err) return handleError(err);

    getPosts(profile.id, (err, posts) => {
      if (err) return handleError(err);

      getComments(posts[0].id, (err, comments) => {
        if (err) return handleError(err);
        console.log("We are 4 levels deep!", comments);
      });
    });
  });
});

getUser(userId) //how it runs?
  // The above code runs asynchronously. It starts by calling getUser with a userId and a callback function.
  // If getUser encounters an error, it will call handleError with the error. If it succeeds, it will call the callback function with the user data.
  // Inside that callback, getProfile is called with the user's profileId and another callback function. This pattern continues for getPosts and getComments,
  // creating a deeply nested structure known as the "Pyramid of Doom."
  // Each level of nesting represents a new asynchronous operation that depends on the previous one.

  .then((user) => getProfile(user.profileId)) //user is passed to the next then() automatically
  .then((profile) => getPosts(profile.id)) //profile is passed to the next then() automatically
  .then((posts) => getComments(posts[0].id))
  .then((comments) => {
    console.log("Flat, readable, and clean!", comments);
  })
  .catch((err) => {
    // A single catch block handles errors from ANY of the steps above
    handleError(err);
  });
//  explain above code
// The first part of the code demonstrates the "Pyramid of Doom," which occurs when multiple asynchronous operations are nested within each other
//  using callbacks. Each callback is dependent on the previous one,
// leading to deeply nested code that is hard to read and maintain. In this example, we are fetching user data,
//  then their profile, then their posts, and finally their comments. If any of these operations fail, an error is handled at each level.

// The second part of the code shows how to flatten this structure using Promises.
// Each asynchronous operation returns a Promise, allowing us to chain them together using .then().
// This results in a more readable and maintainable code structure. Additionally,
// a single .catch() block at the end handles errors from any of the steps, making error handling more centralized and efficient.
