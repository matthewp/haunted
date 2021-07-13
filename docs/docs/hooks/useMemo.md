---
layout: layout-api
package: haunted
module: lib/use-memo.js
---

# Hooks >> useMemo

Create a memoized state value. Only reruns the function when dependent values have changed.

```js playground use-memo use-memo.js
import { component, html, useState, useMemo } from 'haunted';

function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

function App() {
  const [value, setVal] = useState(12);
  const fib = useMemo(() => fibonacci(value), [value]);

  return html`
    <h1>Fibonacci</h1>
    <input type="number" max="35" step="1"
           @change=${e => setVal(parseInt(e.target.value))}
           value=${value} />
    <div>Fibonacci <strong>${fib}</strong></div>
  `;
}

customElements.define('use-memo', component(App));
```

```html playground-file use-memo index.html
<script type="module" src="use-memo.js"></script>
<use-memo></use-memo>
```

## API
