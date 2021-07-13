---
layout: layout-api
package: haunted
module: lib/use-layout-effect.js
---

# Hooks >> useMemo

Create a memoized state value. Only reruns the function when dependent values have changed.

```js
function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

function App() {
  const [value, setVal] = useState(12);
  const fib = useMemo(() => fibonacci(value), [value]);

  return html`
    <h1>Fibonacci</h1>
    <input
      type="text"
      @change=${event => setVal(parseInt(event.target.value, 10))}
      value=${value}
    />
    <div>Fibonacci <strong>${fib}</strong></div>
  `;
}
```
