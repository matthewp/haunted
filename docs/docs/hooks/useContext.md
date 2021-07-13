---
layout: layout-api
package: haunted
module: lib/use-context.js
---

# Hooks >> useContext

Grabs the context value from the closest provider above and updates your component, the consumer, whenever the provider changes the value.

`useContext` currently only works with custom element components, [track the issue here](https://github.com/matthewp/haunted/issues/40).

```js playground use-context use-context.js
import { html, component, useState, useContext, createContext } from 'haunted';

const ThemeContext = createContext('dark');

customElements.define('theme-provider', ThemeContext.Provider);
customElements.define('theme-consumer', ThemeContext.Consumer);

function Consumer() {
  const context = useContext(ThemeContext);
  return context;
}

customElements.define('my-consumer', component(Consumer));

function App() {
  const [theme, setTheme] = useState("light");

  return html`
    <select value=${theme} @change=${event => setTheme(event.target.value)}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>

    <theme-provider .value=${theme}>
      <my-consumer></my-consumer>

      <!-- creates context with inverted theme -->
      <theme-provider .value=${theme === 'dark' ? 'light' : 'dark'}>
        <theme-consumer
          .render=${value =>
            html`<h1>${value}</h1>`
          }
        ></theme-consumer>
      </theme-provider>
    </theme-provider>
  `;
}

customElements.define('use-context', component(App));
```

```html playground-file use-context index.html
<script type="module" src="use-context.js"></script>
<use-context></use-context>
```

## API
