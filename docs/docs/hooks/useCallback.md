---
layout: layout-api
package: haunted
module: lib/use-callback.js
---

# Hooks >> useCallback

Very similar to `useMemo` but instead of writing a function that returns your memoized value, your function is the memoized value. This and `useMemo` are often overused so try to only use this when your callback has dependencies and it is itself a dependency for something else (like `useEffect`) .

```js
const submit = useCallback(event => {
  event.preventDefault();
  api.post('submit', { email, password });
}, [email, password]);

useEffect(() => {
  this.addEventListener('submit', submit);
  return () => this.removeEventListener('submit', submit);
}, [submit]);
```
