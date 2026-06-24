Debounce delays the execution of a function until a certain amount of time has passed since the last time it was called. It groups multiple rapid requests into a single execution at the very end.

Real-World Use Case: Search Autocomplete
If a user types "javascript" into a search box, you don't want to make 10 separate API requests (one for "j", "ja", "jav", etc.). You use debounce so the API request only fires after the user pauses typing for 300ms.

Throttling enforces a maximum number of times a function can be called over a period of time. It executes the function immediately, then blocks all subsequent calls until a specified "cooldown" timer runs out.

Real-World Use Case: Infinite Scroll or Gaming
When a user is scrolling down a page to trigger an infinite scroll, the scroll event fires hundreds of times a second. Debouncing would wait until they completely stop scrolling to load more content (which feels broken). Throttling executes the check at a steady pace (e.g., exactly once every 100ms) while they are actively scrolling.

Feature,Debounce,Throttle
Core Concept,Waits for a pause in the activity.,Limits the execution rate.
When it fires,After the user stops doing the action.,Regularly during the ongoing action.
Timer Behavior,The timer resets on every trigger.,The timer runs on a fixed schedule.
Best Used For,"Text inputs, auto-save, window resizing.","Infinite scroll, mouse tracking, button click spamming."
