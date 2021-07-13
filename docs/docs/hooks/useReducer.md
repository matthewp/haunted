---
layout: layout-api
package: haunted
module: lib/use-reducer.js
---

# Hooks >> useReducer

Similarly to `useState`, `useReducer` will return an array of two values, the first one being the state. The second one, however, is `dispatch`. This is a function that takes an **action**. The action is then passed to your **reducer** (the first argument) and your reducer will determine the new state and return it.

The following is an example of `useReducer` being used to handle incrementing and decrementing a count:

```js playground use-reducer use-reducer.js
import { component, html, useReducer } from 'haunted';

// doesn't have to be an object, could just be `initialState = 0`
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return html`
    Count: ${state.count}
    <button @click=${() => dispatch({ type: 'reset' })}>
      Reset
    </button>
    <button @click=${() => dispatch({ type: 'increment' })}>+</button>
    <button @click=${() => dispatch({ type: 'decrement' })}>-</button>
  `;
}

customElements.define('use-reducer', component(Counter));
```

```html playground-file use-reducer index.html
<script type="module" src="use-reducer.js"></script>
<use-reducer></use-reducer>
```

This might look familiar as [redux](https://redux.js.org/) uses a similar concept.

# API
