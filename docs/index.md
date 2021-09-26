---
title: Haunted
layout: layout-home
templateEngineOverride: njk,md
slogan: Hooks for Web Components
callToActionItems:
  - text: Docs
    href: /docs/
  - text: Guides
    href: /docs/guides/getting-started/
---

<style data-helmet>
  .reason-header { display: none; }
  html { --playground-ide-height: 340px; }
</style>

```js playground example my-counter.js
import { html } from 'https://unpkg.com/lit?module';
import { component, useState } from 'https://unpkg.com/haunted/haunted.js';

function Counter() {
  const [count, setCount] = useState(0);

  return html`
    <div part="count">${count}</div>
    <button part="button" @click=${() => setCount(count + 1)}>
      Increment
    </button>
  `;
}

customElements.define('my-counter', component(Counter));
```

```html playground-file example index.html
<html lang="en">
  <head>
    <script type="module" src="my-counter.js"></script>
    <style>
      body { margin: 0; height: 100vh; }
      body, my-counter {
        display: grid;
        place-items: center;
        text-align: center;
      }

      my-counter {
        gap: 20px;
      }

      my-counter::part(count) {
        font-size: 24px;
      }

      my-counter::part(button) {
        background: transparent;
        border: 4px solid black;
        padding: 6px 12px;
        font-size: 18px;
        border-radius: 8px;
      }

      my-counter::part(button):active {
        background: rgba(0,0,0,0.1);
        transform: translate(1px, 1px);
      }
    </style>
  </head>
  <my-counter></my-counter>
</html>
```
