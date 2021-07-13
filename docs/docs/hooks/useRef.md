---
layout: layout-api
package: haunted
module: lib/use-ref.js
---

# Hooks >> useRef

Creates and returns a mutable object (a 'ref') whose `.current` property is initialized to the passed argument.

This differs from `useState` in that state is immutable and can only be changed via `setState` which **will** cause a rerender. That rerender will allow you to be able to see the updated `state` value. A ref, on the other hand, can only be changed via `.current` and since changes to it are mutations, no rerender is required to view the updated value in your component's code (e.g. listeners, callbacks, effects).

```js
function App() {
  const myRef = useRef(0);
  return html`${myRef.current}`;
}
```
