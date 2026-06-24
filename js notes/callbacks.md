## Callback Hell occurs when asynchronous operations depend on one another, forcing you to nest callbacks inside callbacks. The code grows horizontally faster than it grows vertically, forming an unmistakable pyramid shape. This creates tightly coupled code that is incredibly difficult to read, maintain, and add error handling to.

```
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
```

## Promises flatten this pyramid into a vertical chain. Instead of passing control down into nested functions, each step returns a new Promise, allowing you to handle the flow sequentially and catch all errors in one central place

```
//  The Promise Equivalent (Flat & Scalable)
getUser(userId)
  .then(user => getProfile(user.profileId))
  .then(profile => getPosts(profile.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => {
    console.log("Flat, readable, and clean!", comments);
  })
  .catch(err => {
    // A single catch block handles errors from ANY of the steps above
    handleError(err);
  });
```
