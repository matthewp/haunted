# Haunted 🦇 🎃

React's Hook API but for standard web components and [lit-html](https://polymer.github.io/lit-html/). 

```html
<!doctype html>

<my-counter></my-counter>


<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useState } from 'https://unpkg.com/@matthewp/haunted/haunted.js';

  function Counter() {
    const [count, setCount] = useState(0);

    return html`
      <div id="count">${count}</div>
      <button type="button" @click=${() => setCount(count + 1)}>Increment</button>
    `;
  }

  customElements.define('my-counter', component(Counter));
</script>
```

## Use

For now it is available as the `@matthewp/haunted` package. In the future I hope to get the non-scoped name.

```shell
npm install @matthewp/haunted
```

### Builds

Haunted comes in a few builds, pick the one depending on which environment you are using:

* __index.js__ is available for bundlers such as Webpack and Rollup. Use with: `import { useState } from '@matthewp/haunted';`;
* __web.js__ is avaible for use with the web's native module support. Use with: `import { useState } from '../node_modules/@matthewp/haunted/web.js';`.
* __haunted.js__ is available via the CDN [unpkg](https://unpkg.com). This is great for small apps or for local development without having to install anything. Use with `import { useState } from 'https://unpkg.com/@matthewp/haunted/haunted.js';`

## API

*Haunted* supports the same API as React Hooks. My hope is that by doing so you can reuse hooks available on npm simply by aliasing package names in your bundler's config.

Currently Haunted supports the following hooks:

### useState

Create a tuple of state and a function to change that state.

```js
const [count, setCount] = useState(0);
```

### useEffect

Useful for side-effects that run after the render has been commited.

```html
<!doctype html>

<my-counter></my-counter>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useState, useEffect } from 'https://unpkg.com/@matthewp/haunted/haunted.js';

  function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      document.title = `Clicked ${count} times`;
    });

    return html`
      <div id="count">${count}</div>
      <button type="button" @click=${() => setCount(count + 1)}>Increment</button>
    `;
  }

  customElements.define('my-counter', component(Counter));
</script>
```

### useReducer

Create state that updates after being ran through a reducer function.

```html
<!doctype html>

<my-counter></my-counter>


<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useReducer } from 'https://unpkg.com/@matthewp/haunted/haunted.js';

  const initialState = {count: 0};

  function reducer(state, action) {
    switch (action.type) {
      case 'reset': return initialState;
      case 'increment': return {count: state.count + 1};
      case 'decrement': return {count: state.count - 1};
    }
  }

  function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return html`
      Count: ${state.count}
      <button @click=${() => dispatch({type: 'reset'})}>
        Reset
      </button>
      <button @click=${() => dispatch({type: 'increment'})}>+</button>
      <button @click=${() => dispatch({type: 'decrement'})}>-</button>
    `;
  }

  customElements.define('my-counter', component(Counter));
</script>
```

### useMemo

Create a memoized state value. Only reruns the function when dependent values have changed.

```html
<!doctype html>

<my-app></my-app>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useMemo, useState } from 'https://unpkg.com/@matthewp/haunted/haunted.js';

  function fibonacci(num) {
    if (num <= 1) return 1;

    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  function App() {
    const [value, setVal] = useState(12);
    const fib = useMemo(() => fibonacci(value), [value]);

    return html`
      <h1>Fibonacci</h1>
      <input type="text" @change=${ev => setVal(Number(ev.target.value))} value="${value}">
      <div>Fibonacci <strong>${fib}</strong></div>
    `;
  }

  customElements.define('my-app', component(App));
</script>
```

## License

BSD-2-Clause