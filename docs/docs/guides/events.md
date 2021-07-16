# Guides >> Dispatching Events || 30

<style data-helmet>
  html { --playground-ide-height: 540px; }
</style>

There are a few steps you have to take in order to dispatch an event from your custom element:

1. Use the function syntax to define your component. This will give you access to `this`, the instance of your custom element.
2. When defining your callback that you wish to dispatch from, make sure it is bound to `this`. You can do this by using the fat arrow syntax.
3. Finally, you can create a `new CustomEvent` and pass that to `this.dispatchEvent`.

Here are a couple of examples of dispatching events from a haunted custom element:

```js
{% include ./_assets/store-product.js %}
```

With this, you can now listen for the `buy-product` event either on an instance of `<store-product>` itself or higher up in the DOM. Here are examples of both of these instances:

### Listening on an element

```js
{% include ./_assets/my-store.js %}
```

### Listening higher up in the DOM

```js playground events app.js
import { component, html, useEffect, useState } from 'haunted';
import './my-store.js';

function App(element) {
  const [report, setReport] = useState('');
  useEffect(() => {
    // Because the event bubbled all the way up here,
    // we can listen directly on this web component itself! 🎉
    const onBuyProduct = ({ detail: { productId }}) =>
      setReport(`product id ${productId} ordered`);

    element.addEventListener('buy-product', onBuyProduct);

    // very important to remove the event listener!
    return () =>
      element.removeEventListener('buy-product', onBuyProduct);
  }, []); // make sure you list all dependencies

  return html`
    <my-store></my-store>
    <p><output>${report}</output></p>
  `;
}

customElements.define('my-app', component(App));
```

```html playground-file events index.html
<my-app></my-app>
<script type="module" src="app.js"></script>
```

```js playground-file events my-store.js
import { html, component, useState } from 'haunted';

import './store-product.js';

{% include ./_assets/my-store.js %}

customElements.define('my-store', component(Store));
```

```js playground-file events store-product.js
import { component, html } from 'haunted';

{% include ./_assets/store-product.js %}

customElements.define('store-product', component(Product));
```

If you want to look more into firing events, here are some links:

* [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) — MDN
* [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) — MDN
* [`dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) — MDN
* [Creating and triggering events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) — MDN
* ["Shadow DOM and Events"](https://javascript.info/shadow-dom-events) — Ilya Kantor
