## Array destructuring — position-based extraction

```
const rgb = [255, 128, 0]

// Without destructuring
const red   = rgb[0]
const green = rgb[1]
const blue  = rgb[2]

// With destructuring — mirrors the array's shape on the left
const [red, green, blue] = rgb
// red = 255, green = 128, blue = 0

// Skip elements with commas
const [,, blue] = rgb              // only need blue
const [first,, third] = [1, 2, 3]  // first=1, third=3

// Rest element — captures remaining items
const [head, ...tail] = [1, 2, 3, 4, 5]
// head = 1, tail = [2, 3, 4, 5]

// Default values — used when the value is undefined
const [a = 10, b = 20, c = 30] = [1, 2]
// a = 1, b = 2, c = 30 — c was undefined so default kicks in

// Swap variables — no temp variable needed
let x = 1, y = 2
;[x, y] = [y, x]
// x = 2, y = 1


// From function return values
function minMax(arr) {
  return [Math.min(...arr), Math.max(...arr)]
}
const [min, max] = minMax([3, 1, 4, 1, 5, 9])
// min = 1, max = 9
```

## Object destructuring — name-based extraction

```
const user = { name: 'Alice', age: 30, role: 'admin', active: true }

// Basic — variable names must match property names
const { name, age } = user
// name = 'Alice', age = 30

// Rename — extract with a different variable name
const { name: userName, role: userRole } = user
// userName = 'Alice', userRole = 'admin'
// 'name' and 'role' no longer exist as variable names

// Default values — used when the property is undefined
const { name, score = 0, level = 1 } = user
// score = 0 (not in user), level = 1 (not in user), name = 'Alice'

// Rename AND default together
const { displayName: name = 'Anonymous' } = user
// user has no 'displayName', so name = 'Anonymous'

// Rest — collect remaining properties
const { name, age, ...rest } = user
// rest = { role: 'admin', active: true }

// Picking specific properties from an object
const { name, role } = user  // only extract what you need

```

## Nested destructuring — matching deep structures

```
const response = {
  status: 200,
  data: {
    user: {
      id: 1,
      name: 'Alice',
      address: {
        city: 'Paris',
        country: 'France'
      }
    },
    permissions: ['read', 'write']
  }
}

// Nested object destructuring
const {
  status,
  data: {
    user: {
      name,
      address: { city, country }
    },
    permissions: [firstPermission, ...otherPermissions]
  }
} = response

// status = 200, name = 'Alice', city = 'Paris', country = 'France'
// firstPermission = 'read', otherPermissions = ['write']

// Note: 'data', 'user', 'address', 'permissions' are NOT created as variables
// They are patterns used to navigate — only the leaf variable names exist


```

```
const { a = 1, b = 2, c = 3 } = { a: 10, b: null };
console.log(a); //output 10
console.log(b); //null
console.log(c); // 3
```
