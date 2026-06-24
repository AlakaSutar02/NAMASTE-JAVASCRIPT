## a prototype is a built-in mechanism that allows objects to inherit features and methods from one another.

## JavaScript is a prototype-based language. Every JavaScript object has a secret link to another object, which is its prototype.

### Whenever you try to access a property or a method on an object, JavaScript plays a game of hide-and-seek called the Prototype Chain:

It looks inside the object itself.
If it's not there, it follows a hidden link ([[Prototype]]) to the parent object and looks there.
It keeps climbing up until it finds it or hits null (the end of the line), returning undefined.

Think about when you create an array and use a method like .push() or .map(). You didn't write those methods yourself, so where did they come from?

```
const myNumbers = [1, 2, 3];

// .push() lives on Array.prototype, not on your specific 'myNumbers' object
myNumbers.push(4);
```

Because myNumbers is an Array, it automatically inherits all the methods stored in Array.prototype.

Use hasOwnProperty() to check if a property is directly on the object vs inherited.

Arrays on the prototype are shared by all instances. list1.items.push() mutates the single shared array, so list2 sees it too.

```
"The best way to look at a prototype is that it’s JavaScript’s live fallback system.Take a standard array: when I call myArray.push(), that specific array instance doesn’t actually own a push function. Instead, it delegates the request up its hidden internal link to Array.prototype, where the master method lives.Even when we write modern ES6 class User {} today, that is purely syntax sugar over this exact system. If you run typeof User, it still spits out 'function', and any methods inside that class are just being hung directly onto User.prototype.You can actually see the mechanics of this if you recreate the new keyword manually. When we call new User(), JavaScript is just running four silent steps: it creates a blank object {}... it uses Object.create() to point that object's internal link to User.prototype... it binds this to the instance... and it returns it.Because of that link, property lookups become a strict ladder. If I ask an instance for .name, JavaScript asks: 'Is this an own property?'—which we verify with hasOwnProperty(). If yes, it returns it. If no, it steps up the ladder: Instance $\rightarrow$ Constructor Prototype $\rightarrow$ Object Prototype, and finally hits null, returning undefined.(Slight pause, drop the tone slightly)The most critical thing to keep in mind with this at scale, though, is that the chain is live and globally shared. If you write an object-merging function and fail to sanitize user input, an attacker can slip in a __proto__ payload, globally overwrite Object.prototype, and cause an application-wide Prototype Pollution vulnerability."
```
