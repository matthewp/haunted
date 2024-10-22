---
layout: layout-api
package: haunted
module: lib/use-provide-context.js
---

# Hooks >> useProvideContext

Makes your component become a Context provider. It updates every nested consumer with the current value. You can optionally use a deps array (useful when the context value is mutated instead of being replaced).

```js playground use-provide-context use-provide-context.js
import {
  html,
  component,
  useState,
  useContext,
  createContext,
  useProvideContext,
} from "haunted";

const ThemeContext = createContext("dark");

customElements.define("theme-consumer", ThemeContext.Consumer);

function Consumer() {
  const context = useContext(ThemeContext);
  return context;
}

customElements.define("my-consumer", component(Consumer));

function App() {
  const [theme, setTheme] = useState("light");
  useProvideContext(ThemeContext, theme);

  return html`
    <select value=${theme} @change=${(event) => setTheme(event.target.value)}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>

    <my-consumer></my-consumer>

    <theme-provider .value=${theme === "dark" ? "light" : "dark"}>
      <theme-consumer
        .render=${(value) =>
          html`
            <h1>${value}</h1>
          `}
      ></theme-consumer>
    </theme-provider>
  `;
}

customElements.define("use-provide-context", component(App));
```

```html playground-file use-provide-context index.html
<script type="module" src="use-provide-context.js"></script>
<use-provide-context></use-provide-context>
```

## API
