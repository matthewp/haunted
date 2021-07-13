---
layout: layout-api
package: haunted
module: lib/use-controller.js
---

# Hooks >> useController

Reuse existing `ReactiveController`s in your haunted component without adding `@lit/reactive-element` to your bundle.

```js playground use-controller use-controller.js
import { component, html, useController, useEffect } from 'haunted'

import { MouseController } from './mouse-controller.js';

function TrackMouse() {
  const { pos, down } = useController(host => new MouseController(host));

  useEffect(() => {
    const x = pos.x - this.clientLeft;
    const y = pos.y - this.clientTop;
    if (x > this.clientWidth || y > this.clientHeight) return;
    const hue = Math.floor((x / this.clientWidth) * 360);
    const saturation = 100 - Math.floor((y / this.clientHeight) * 100);
    this.style.setProperty('--x', `${x}px`);
    this.style.setProperty('--y', `${y}px`);
    this.style.setProperty('--hue', hue);
    this.style.setProperty('--saturation', `${saturation}%`);
    this.style.setProperty('--loupe-border-color', down ? 'white' : 'black');
    if (down) {
      this.color = getComputedStyle(this.shadowRoot.getElementById('loupe')).getPropertyValue('background-color');
      this.shadowRoot.getElementById('alert').textContent = this.color;
      this.shadowRoot.getElementById('alert').setAttribute("aria-hidden", "false");
      this.dispatchEvent(new CustomEvent('pick'));
    }
  }, [pos, down]);

  return html`
    <link rel="stylesheet" href="color-picker.css">
    <div id="loupe" role="button" aria-label="color picker"></div>
    <div id="alert" role="alert" aria-hidden="true"></div>
  `;
}

customElements.define('use-controller', component(TrackMouse));
```

```css playground-file use-controller color-picker.css
:host {
  display: block;
  min-height: 100px;
  min-width: 100px;
  cursor: crosshair;
  background:
    linear-gradient(to bottom, transparent, hsl(0 0% 50%)),
    linear-gradient(
      to right,
      hsl(0 100% 50%) 0%,
      hsl(0.2turn 100% 50%) 20%,
      hsl(0.3turn 100% 50%) 30%,
      hsl(0.4turn 100% 50%) 40%,
      hsl(0.5turn 100% 50%) 50%,
      hsl(0.6turn 100% 50%) 60%,
      hsl(0.7turn 100% 50%) 70%,
      hsl(0.8turn 100% 50%) 80%,
      hsl(0.9turn 100% 50%) 90%,
      hsl(1turn 100% 50%) 100%
    );
}

#loupe {
  display: block;
  height: 40px;
  width: 40px;
  border: 3px solid var(--loupe-border-color, black);
  border-radius: 100%;
  background: hsl(var(--hue, 0) var(--saturation, 100%) 50%);
  transform: translate(var(--x, 0), var(--y, 0));
  transition: border-color 0.1s ease-in-out;
  will-change: background, transform;
}

#alert {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

```js playground-file use-controller mouse-controller.js
export class MouseController {
  down = false;

  pos = { x: 0, y: 0 };

  onMousemove = e => {
    this.pos = { x: e.clientX, y: e.clientY };
    this.host.requestUpdate();
  };

  onMousedown = e => {
    this.down = true;
    this.host.requestUpdate();
  };

  onMouseup = e => {
    this.down = false;
    this.host.requestUpdate();
  };

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mousedown', this.onMousedown);
    window.addEventListener('mouseup', this.onMouseup);
  }

  hostDisconnected() {
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mousedown', this.onMousedown);
    window.removeEventListener('mouseup', this.onMouseup);
  }
}
```

```html playground-file use-controller index.html
<script type="module" src="use-controller.js"></script>
<use-controller></use-controller>
<output></output>
<script>
  document.querySelector('use-controller')
    .addEventListener('pick', event => {
      document
        .querySelector('output')
        .style
        .setProperty('background-color', event.target.color);
    });
</script>
<style>
  body {
    margin: 0;
    display: grid;
    height: 100vh;
    grid-template-rows: 2fr 1fr;
  }
</style>
```

```liquid playground-import-map use-controller
{{ importMap }}
```
## API
