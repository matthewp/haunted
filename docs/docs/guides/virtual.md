# Guides >> Virtual Components || 40

Haunted also has the concept of _virtual components_. These are components that are not defined as a tag. Instead they're defined as functions that can be called from within another template. They have their own state and will rerender when that state changes _without_ causing any parent components to rerender.

The following is an example of using virtual components:

```js playground virtual my-app.js
import { component, html, virtual, useState } from 'haunted';

const Counter = virtual(() => {
  const [count, setCount] = useState(0);

  return html`
    <button type="button" @click=${() => setCount(count + 1)}>
      ${count}
    </button>
  `;
});

function App() {
  return html`
    <main>
      <h1>My app</h1>
      ${Counter()}
    </main>
  `;
}

customElements.define('my-app', component(App));
```

```html playground-file virtual index.html
<script type="module" src="my-app.js"></script>
<my-app></my-app>
```

Notice that we have `Counter`, a virtual component, and `App`, a custom element. You can use virtual components within custom elements and custom elements within virtual components.

The only difference is that custom elements are utilized via their tag name (e.g. `<my-app>`) and virtual components are called as functions (e.g. `${Counter()}`).

If you wanted you could create an entire app of virtual components.

##### Virtual components and `this`

You'll notice that in the above examples, we're using the fat arrow syntax. This is due to virtual components not being attached to any actual custom elements, therefore, `this` never points to anything which negates the purpose of using the function syntax.
