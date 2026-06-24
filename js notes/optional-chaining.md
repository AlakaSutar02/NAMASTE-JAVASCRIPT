The ?. operator evaluates the left side. If it is null or undefined, it short-circuits and returns undefined without evaluating the right side. If it has a value, evaluation continues normally.

```
const user = {
  profile: {
    address: { city: 'Mumbai' }
  }
}

// Optional chaining — clean and crash-safe
const city = user?.profile?.address?.city
console.log(city)   // 'Mumbai'

```

The position of ?. matters. It checks whether the thing immediately to its left is null or undefined.

The ?? operator returns its right-hand side only when its left-hand side is null or undefined. All other values, including false, 0, NaN, and "", pass through unchanged.

```
// ?? — only triggers on null/undefined
console.log(null ?? 'default') // 'default'
console.log(undefined ?? 'default') // 'default'
console.log(0 ?? 'default') // 0 — 0 is a valid value
console.log(false ?? 'default') // false — false is a valid value
console.log('') ?? 'default') // '' — empty string is valid
console.log(NaN ?? 'default') // NaN — passes through
```

Combining ?. and ?? — the most common real-world pattern
Optional chaining and nullish coalescing are designed to work together. ?. safely navigates, ?? provides the fallback for when navigation produces nothing.

```
const config = {
  theme: {
    dark: {
      background: '#1a1a1a'
    }
  }
}

// Get value or fallback to default
const bg       = config?.theme?.dark?.background ?? '#ffffff'
const fontSize = config?.theme?.dark?.fontSize   ?? 16

// API response handling
const users    = response?.data?.users   ?? []
const total    = response?.meta?.total   ?? 0
const userName = response?.user?.name    ?? 'Anonymous'

// Event handling
const value    = event?.target?.value?.trim() ?? ''

```

The ?. with || trap — the most common interview output question
When combining ?. with ||, the precedence and short-circuit interactions produce non-obvious output. This appears frequently as an output prediction question.

const obj = { value: 0 }

console.log(obj?.value || 'missing') // 'missing' — value is 0 (falsy), || kicks in
console.log(obj?.value ?? 'missing') // 0 — 0 is not null/undefined, ?? does not kick in

const obj2 = null
console.log(obj2?.value || 'missing') // 'missing' — undefined is falsy
console.log(obj2?.value ?? 'missing') // 'missing' — undefined triggers ??
