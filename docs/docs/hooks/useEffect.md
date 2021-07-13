---
layout: layout-api
package: haunted
module: lib/use-effect.js
---

# Hooks >> useEffect

<style data-helmet>
  html { --playground-ide-height: 440px; }
</style>

Used to run a side-effect when the component rerenders or when a dependency changes. To run your side-effect only when the component rerenders, only pass in your side-effect function and nothing else:

```js playground use-effect use-effect.js
import { component, html, useState, useEffect } from 'haunted';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // on every render, a new number will be in the title
    document.title = `A random number ${Math.random()}`;
  });

  return html`
    <header>${document.title ?? 'Click the Button'}</header>
    <div id="count">${count}</div>
    <button type="button" @click=${() => setCount(count + 1)}>
      Cause rerender
    </button>
  `;
}

customElements.define('use-effect', component(Counter));
```

```html playground-file use-effect index.html
<script type="module" src="use-effect.js"></script>
<use-effect></use-effect>
```

```liquid playground-import-map use-effect
{{ importMap }}
```

### Dependencies

What happens when your code begins to rely on dependencies that can change (state, refs, props)? We no longer want it to rerun on every rerender so we need to ensure that the code we're running, or its result, doesn't become stale. To do this, you should always state all of the dependencies you're using in an array as the second argument to `useEffect`:

```js
const [name, setName] = useState('Dracula');

useEffect(() => {
  // This only occurs when `name` changes and on the initial render.
  document.title = `Hello ${name}`;
}, [name]);
```

A dependency is anything that your side-effect relies on that can change between renders (e.g. state, refs, props). This does not include `setName` or other setters from `useState` because they will never change between renders.

# What if I want to run the side-effect on mount?

Generally, you won't want to do this but rather make sure you're actually listing all of your dependencies in the dependency array. If you don't have any dependencies then your code will run on mount and clean up on unmount.

Here is an example of only running an effect once as opposed to every rerender:

```js
useEffect(() => {
  document.title = 'I will stay like this until someone changes me';
}, []); // note that you must pass the empty array
```

## Cleaning up side-effects

Since effects are used for side-effectual things and might run many times in the lifecycle of a component, `useEffect` supports returning a teardown function.

An example of when you might use this is if you are setting up an event listener:

```js
const [name, setName] = useState('Wolf Man');

useEffect(() => {
  function updateNameFromWorker(event) {
    setName(event.data);
  }

  worker.addEventListener('message', updateNameFromWorker);

  return () => {
    worker.removeEventListener('message', updateNameFromWorker);
  };
}, []); // note that it is safe to exclude `setName` from the dependencies because it will never change
```

## API
