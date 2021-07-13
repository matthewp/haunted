---
layout: layout-api
package: haunted
module: lib/use-layout-effect.js
---

# Hooks >> useLayoutEffect

The function signature is the same as `useEffect`, but the callback is being called synchronously after rendering. Therefore, updates scheduled inside `useLayoutEffect` will be flushed synchronously before the browser has a chance to paint.

Most of the time, it is preferable to use `useEffect` to avoid blocking visual updates.
