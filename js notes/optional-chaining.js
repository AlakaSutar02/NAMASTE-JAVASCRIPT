let person = { name: "John", address: { street: "123 Main St" } };
let unknownPerson = null;
console.log(person.address?.street); // 123 Main St
console.log(unknownPerson?.address?.street ?? "Unknown"); // unknown
console.log(person.phone ?? "(no phone)"); // (no phone)

const user = { profile: { city: "NY" } };
console.log(user?.profile?.city); // NY
console.log(user?.settings?.theme); // undefined

// Optional chaining
const city = user?.address?.city;
const name = users?.[0]?.name;
const val = obj?.method?.();
// Nullish coalescing — fallback for null/undefined ONLY
const count = user.count ?? 0;
// if count=0, result is 0 (correct!)
// vs OR operator:
const bad = user.count || 0;
// if count=0, bad=0 but for wrong reason (0 is falsy)

//Chaining Promises with Optional Chaining and Nullish Coalescing
function fetchUserData() {
  return Promise.resolve({ id: 1, name: "John Doe" });
}

function fetchOrderData(userId) {
  return Promise.resolve([
    { id: 101, total: 100 },
    { id: 102, total: 200 },
  ]);
}

fetchUserData()
  .then((user) => {
    const orderId = user?.orders?.[0]?.id ?? "No orders found";
    console.log(orderId); // Output: No orders found
    return fetchOrderData(user.id);
  })
  .then((orders) => {
    console.log(orders); // Output: [{ id: 101, total: 100 }, { id: 102, total: 200 }]
    const total = orders?.[0]?.total ?? 0;
    console.log(total); // Output: 100
  });

// resolve
function getPokemon() {
  return new Promise((resolve) => {
    resolve({
      name: "Pikachu",
      abilities: {
        ability1: "Static",
        ability2: null,
      },
    });
  });
}

getPokemon().then((pokemon) => {
  console.log(pokemon.name); // Pikachu
  console.log(pokemon.abilities?.ability2 ?? "Not found"); //output: Not found
  console.log(pokemon.abilities?.ability3 ?? "Not found"); //output: Not found
});
