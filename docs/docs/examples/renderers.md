# Examples >> Bring your Own Renderer || 10

<style data-helmet>
  html { --playground-ide-height: 420px; } /* lol you said 420 */
</style>

The main entry point is intended for [lit-html](https://github.com/Polymer/lit-html) users. If you are using [lighterhtml](https://github.com/WebReflection/lighterhtml) or [hyperHTML](https://github.com/WebReflection/hyperHTML) then instead import `haunted/core`. This export gives you a function that creates Hooks that work with any template library.

```js playground lighterhtml my-app.js
import haunted, { useState } from 'haunted/core';
import { html, render } from 'lighterhtml';

const { component } = haunted({
  render(what, where) {
    render(where, () => what);
  }
});

function App() {
  const [count, setCount] = useState(0);
  return html`
    <h2>Using lighterhtml!</h2>
    <div>Count: ${count}</div>
    <button part="button" onclick=${() => setCount(count + 1)}>Increment</button>
  `;
}

customElements.define('my-app', component(App));
```

```html playground-file lighterhtml index.html
<html lang="en">
  <head>
    <script type="module" src="my-app.js"></script>
    <style>
      body { margin: 0; height: 100vh; }
      body, my-app {
        display: grid;
        place-items: center;
        text-align: center;
      }
      body, my-app {
        display: grid;
        place-items: center;
        text-align: center;
      }

      my-app {
        gap: 20px;
      }

      my-app::part(count) {
        font-size: 24px;
      }

      my-app::part(button) {
        background: transparent;
        border: 4px solid black;
        padding: 6px 12px;
        font-size: 18px;
        border-radius: 8px;
      }

      my-app::part(button):active {
        background: rgba(0,0,0,0.1);
        transform: translate(1px, 1px);
      }
    </style>
  </head>
  <my-app></my-app>
</html>
```

```handlebars playground-import-map lighterhtml
{{ importMap }}
```
