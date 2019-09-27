import { component, html } from '../haunted.js';
import { attach, mount, cycle } from './helpers.js';

describe('Observed attributes', () => {
  it('Trigger rerenders', async () => {
    const tag = 'attrs-test';

    function app({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    app.observedAttributes = ['name'];

    customElements.define(tag, component(app));

    let teardown = attach(tag);
    await cycle();

    let inst = document.querySelector(tag);
    inst.setAttribute('name', 'world');

    await cycle();

    let div = host.firstChild.shadowRoot.firstElementChild;
    assert.equal(div.textContent, 'Hello world');
    teardown();
  });

  it('Can observe the "title" attribute', async () => {
    const tag = 'attrs-test-title';

    function app() {
      this.setAttribute('title', 'bar');
    }

    app.observedAttributes = ['title'];

    customElements.define(tag, component(app));

    let teardown = attach(tag);
    await cycle();

    let inst = document.querySelector(tag);
    assert.equal(inst.getAttribute('title'), 'bar', 'on the instance');
    teardown();
  });

  it('Trigger rerenders while declared as an option', async () => {
    const tag = 'attrs-options-test';

    function app({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    customElements.define(tag, component(app, {observedAttributes: ['name']}));

    let teardown = attach(tag);
    await cycle();

    let inst = document.querySelector(tag);
    inst.setAttribute('name', 'world');

    await cycle();

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

    let template = document.createElement('template');
    template.innerHTML = `
      <attrs-initial-test name="world"></attrs-initial-test>
    `;
    let frag = template.content.cloneNode(true);
    host.appendChild(frag);
    await cycle();

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

    await cycle();
    teardown();

    assert.equal(typeof val, 'boolean');
    assert.equal(val, true, 'is a boolean');
  });

  it('renderer receives component as this context', async () => {
    const tag = 'attrs-test-2';

    function app({ name = '' }) {
      return html`<div>${name} ${this.name}</div>`;
    }

    app.observedAttributes = ['name'];

    customElements.define(tag, component(app));

    let teardown = attach(tag);
    await cycle();

    let inst = document.querySelector(tag);
    inst.setAttribute('name', 'test');

    await cycle();

    let div = host.firstChild.shadowRoot.firstElementChild;
    assert.equal(div.textContent, 'test test');
    teardown();
  });

  it('observed attribute names turn into camelCase props', async () => {
    const tag = 'attrs-camelcase-test';
    let el;

    function Drawer(element) {
      el = element;
      return html`Test`;
    }

    Drawer.observedAttributes = [
      'open',
      'open-a',
      'open-b-b',
      'openc-',
      'open-d',
      'open-ee',
      'open--fff'
    ];

    customElements.define(tag, component(Drawer));
    let teardown = mount(`
      <attrs-camelcase-test 
        open
        open-a
        open-b-b
        openc-
        open-d
        open-ee
        open--fff
        ></attrs-camelcase-test>
    `);

    await cycle();
    teardown();
    assert.equal(el.open, true, 'is defined');
    assert.equal(el.openA, true, 'is defined');
    assert.equal(el.openBB, true, 'is defined');
    assert.equal(el.openc, true, 'is defined');
    assert.equal(el.openD, true, 'is defined');
    assert.equal(el.openEe, true, 'is defined');
    assert.equal(el.openFff, true, 'is defined');
  });

})
