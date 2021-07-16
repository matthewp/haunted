function Store() {
  const [{ name }, setPurchased] = useState({});

  return html`
    <store-product
      name="T-Shirt"
      price="10.00"
      product-id="0001"
      @buy-product=${event => setPurchased(event.detail)}
    ></store-product>

    <p ?hidden=${!name}><output>${name} Purchased</output></p>
  `;
}
