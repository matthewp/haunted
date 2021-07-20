function Product({ name, price, productId }) {
  const buyProduct = () => {
    const event = new CustomEvent('buy-product', {
      bubbles: true, // this let's the event bubble up through the DOM
      composed: true, // this let's the event cross the Shadow DOM boundary
      detail: { name, price, productId } // all data you wish to pass must be in `detail`
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
