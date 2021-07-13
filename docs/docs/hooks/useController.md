---
layout: layout-api
package: haunted
module: lib/use-controller.js
---

# Hooks >> useController

Reuse existing `ReactiveController`s in your haunted component without adding `@lit/reactive-element` to your bundle.

```js
import { component, html, useController } from 'haunted'

// See example at https://lit.dev/docs/composition/controllers/#external-inputs
import { MouseController } from './mouse-controller';

const useMouseController = useController(host => new MouseController(host));

function TrackMouse() {
  const { pos } = useMouseController();

  return html`
    <dl>
      <dt>x</dt> <dd>${pos.x}</dd>
      <dt>y</dt> <dd>${pos.y}</dd>
    </dl>
  `;
}
```
