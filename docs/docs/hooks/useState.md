---
layout: layout-api
package: haunted
module: lib/use-state.js
---

# Hooks >> useState

<style data-helmet>
  html { --playground-ide-height: 225px; }
</style>

Returns an array of two values. The first value is the immutable state that is initialized to the argument you pass in. The second value is the function that is used to change the first value (the setter).

When the setter is called, the element in which the state resides is rerendered.

```js playground use-state use-state.js
import { component, html, useState, useEffect } from 'haunted';

customElements.define('use-state', component(function Counter() {
  const [count, setCount] = useState(0);
  return html`
    Count: ${count}
    <button @click=${() => setCount(count + 1)}>Increment</button>
  `;
}));
```

```html playground-file use-state index.html
<script type="module" src="use-state.js"></script>
<use-state></use-state>
```

```liquid playground-import-map use-state
{{ importMap }}
```

Additionally if you provide a function as the argument to `useState`, the function is called to initialize the first state, but never called again.

```js
const [count, setCount] = useState(() => {
  return expensiveComputation(42);
});
```

## API
