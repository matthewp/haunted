# Examples >> Dispatching Events || 30

<style data-helmet>
  html { --playground-ide-height: 420px; }
</style>

There are a few steps you have to take in order to dispatch an event from your custom element:

1. Use the function syntax to define your component. This will give you access to `this`, the instance of your custom element.
2. When defining your callback that you wish to dispatch from, make sure it is bound to `this`. You can do this by using the fat arrow syntax.
3. Finally, you can create a `new CustomEvent` and pass that to `this.dispatchEvent`.

Here are a couple of examples of dispatching events from a haunted custom element:

```js playground events store-product.js
import { component, html } from 'haunted';

function Product({ name, price, productId }) {
  const buyProduct = () => {
    const event = new CustomEvent('buy-product', {
      bubbles: true, // this let's the event bubble up through the DOM
      composed: true, // this let's the event cross the Shadow DOM boundary
      detail: { productId } // all data you wish to pass must be in `detail`
    });
    this.dispatchEvent(event);
  }

  return html`
    <article>
      <h3>${name}</h3>
      <p>Price: ${price} USD</p>
      <button @click=${buyProduct}>Purchase</button>
    </article>
  `;
}

Product.observedAttributes = ['name', 'price', 'product-id'];

customElements.define('store-product', component(Product));
```

```html playground-file events index.html
<store-product name="Cool Shoes!" price="1000" product-id="cool-shoes"></store-product>
<output role="alert"></output>
<script>
  document.querySelector('store-product')
    .addEventListener('buy-product', event => {
      document.querySelector('output').textContent = `You bought ${event.detail.productId}`;
    });
</script>
<!-- playground-hide -->
<script type="module" src="store-product.js"></script>
<!-- playground-hide-end -->
```

```handlebars playground-import-map events
{{ importMap }}
```
