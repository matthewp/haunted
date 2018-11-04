import { component, html } from '../web.js';
import { attach, afterMutations, mount, later } from './helpers.js';

describe('Observed attributes', () => {
  it('Trigger rerenders', async () => {
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

  it('Initial attributes are reflected', async () => {
    const tag = 'attrs-initial-test';

    function app({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    app.observedAttributes = ['name'];

    customElements.define(tag, component(app));

    let p = afterMutations();
    let template = document.createElement('template');
    template.innerHTML = `
      <attrs-initial-test name="world"></attrs-initial-test>
    `;
    let frag = template.content.cloneNode(true);
    host.appendChild(frag);
    await later();

    let inst = document.querySelector(tag);
    inst.setAttribute('name', 'world');

    await later();

    let div = host.firstElementChild.shadowRoot.firstElementChild;
    assert.equal(div.textContent, 'Hello world');
    host.innerHTML =  '';
  });

  it('Boolean attributes are turned into booleans', async () => {
    const tag = 'attrs-boolean-test';
    let val;

    function Drawer({ open }) {
      val = open;
      return html`Test`;
    }

    Drawer.observedAttributes = ['open'];

    customElements.define(tag, component(Drawer));
    let teardown = mount(`
      <attrs-boolean-test open></attrs-boolean-test>
    `);

    await later();
    teardown();

    assert.equal(typeof val, 'boolean');
    assert.equal(val, true, 'is a boolean');
  });
})