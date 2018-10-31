import { component, html } from '../web.js';
import { attach, afterMutations, later } from './helpers.js';

describe('Observed attributes', () => {
  it('Trigger rerendres', async () => {
    const tag = 'attrs-test';

    function app({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    app.observedAttributes = ['name'];

    customElements.define(tag, component(app));

    let p = afterMutations();
    let teardown = attach(tag);
    await later();

    let inst = document.querySelector(tag);
    inst.setAttribute('name', 'world');

    await later();

    let div = host.firstChild.shadowRoot.firstElementChild;
    assert.equal(div.textContent, 'Hello world');
    teardown();
  });
})