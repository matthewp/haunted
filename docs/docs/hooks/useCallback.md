---
layout: layout-api
package: haunted
module: lib/use-callback.js
---

# Hooks >> useCallback

Very similar to `useMemo` but instead of writing a function that returns your memoized value, your function is the memoized value. This and `useMemo` are often overused so try to only use this when your callback has dependencies and it is itself a dependency for something else (like `useEffect`) .

```js playground use-callback use-callback.js
import { component, html, useCallback, useState, useEffect } from 'haunted';

const input = setter => e => setter(e.target.value);

customElements.define('use-callback', component(function Counter() {
  const [email, setEmail] = useState('');
  const [pword, setPword] = useState('');
  const [response, setResponse] = useState('');

  const submit = useCallback(async event => {
    event.preventDefault();
    api.post('submit', { email, pword })
      .then(r => r.text())
      .then(x => setResponse(x));
  }, [email, pword]);

  useEffect(() => {
    this.shadowRoot.addEventListener('submit', submit);
    return () => this.shadowRoot.removeEventListener('submit', submit);
  }, [submit]);

  return html`
    <form>
      <label> Email
        <input type="email"
            .value=${email}
            @input=${input(setEmail)}
            required /> </label>
      <label> Password
        <input type="password"
            .value=${pword}
            @input=${input(setPword)}
            required /> </label>
      <button type="submit">Submit</button>
      <output>${response}</output>
    </form>
  `;
}));
```

```html playground-file use-callback index.html
<script type="module" src="use-callback.js"></script>
<use-callback></use-callback>
<!-- playground-hide -->
<script>
  window.api = {
    post(place, { email, pword }) {
      return new Promise(r => {
        const resp = `Created user for ${email} with password ${[...pword].map(x => '*').join('')}`;
        setTimeout(() => {
          r(new Response(new Blob([resp])))
        }, Math.random() * 10);
      })
    }
  }
</script>
<!-- playground-hide-end -->
```

```liquid playground-import-map use-callback
{{ importMap }}
```

## API
