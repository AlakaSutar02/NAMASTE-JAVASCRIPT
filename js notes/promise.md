Promise.all() — waits for ALL to resolve. Rejects immediately if ANY rejects. Use when all must succeed.
Promise.allSettled() — waits for ALL to settle (resolve OR reject). Never rejects itself. Use when you need all results regardless of failure.
Promise.race() — settles with the FIRST settled promise (resolve or reject). Use for timeout patterns.
Promise.any() — resolves with the FIRST resolved promise. Rejects only if ALL reject. Use for fallback/redundancy.
