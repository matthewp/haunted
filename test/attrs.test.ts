import { component, html } from '../src/haunted';
import { fixture, expect, nextFrame } from '@open-wc/testing';


describe('Observed attributes', () => {
  it('Trigger rerenders', async () => {
    const tag = 'attrs-test';

    interface Props {
      name: string;
    }

    function App({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(App, {observedAttributes: ['name']})
    );

    const el = await fixture(html`<attrs-test></attrs-test>`);
    const inst = document.querySelector(tag);
    inst.setAttribute('name', 'world');

    await nextFrame();

    expect(el.shadowRoot.firstElementChild.textContent).to.equal('Hello world');
  });

  it('Can observe the "title" attribute', async () => {
    const tag = 'attrs-test-title';

    interface Props {
      title: string;
    }

    function App(this: unknown) {
      (this as HTMLElement).setAttribute('title', 'bar');
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(App, {observedAttributes: ['title']})
    );

    const el = await fixture(html`<attrs-test-title></attrs-test-title>`);

    expect(el.getAttribute('title')).to.equal('bar');
  });

  it('Trigger rerenders while declared as an option', async () => {
    const tag = 'attrs-options-test';

    interface Props {
      name: string;
    }

    function App({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(App, {observedAttributes: ['name']})
    );

    const el = await fixture(html`<attrs-options-test></attrs-options-test>`);

    el.setAttribute('name', 'world');

    await nextFrame();

    expect(el.shadowRoot.textContent).to.equal('Hello world');
  });

  it('Initial attributes are reflected', async () => {
    const tag = 'attrs-initial-test';

    interface Props {
      name: string;
    }

    function App({ name = '' }) {
      return html`<div>Hello ${name}</div>`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(App, {observedAttributes: ['name']})
    );

    const el = await fixture
      (html`<attrs-initial-test name="world"></attrs-initial-test>`);

    await nextFrame();

    expect(el.shadowRoot.textContent).to.equal('Hello world');
  });

  it('Boolean attributes are turned into booleans', async () => {
    const tag = 'attrs-boolean-test';
    let val: boolean;

    interface Props {
      open: boolean;
    }

    function Drawer({ open }) {
      val = open;
      return html`Test`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(Drawer, {observedAttributes: ['open']})
    );

    const el = await fixture
      (html`<attrs-boolean-test open></attrs-boolean-test>`) as HTMLElement & Props;

    expect(typeof el.open).to.equal('boolean');
    expect(typeof val).to.equal('boolean');
    expect(el.open ).to.be.true;
    expect(val).to.be.true;
  });

  it('Boolean attributes are undefined when not present', async () => {
    const tag = 'attrs-boolean-false-test';
    let val: boolean;

    interface Props {
      open: boolean;
    }

    function Drawer({ open }) {
      val = open;
      return html`Test`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(Drawer, {observedAttributes: ['open']})
    );

    const el = await fixture
      (html`<attrs-boolean-false-test></attrs-boolean-false-test>`) as HTMLElement & Props;

    expect(el.open).to.be.undefined;
    expect(val).to.be.undefined;
  });

  it('renderer receives component as this context', async () => {
    const tag = 'attrs-test-2';

    interface Props {
      name: string;
    }

    function App({ name = '' }) {
      return html`<div>${name} ${this.name}</div>`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(App, {observedAttributes: ['name']})
    );

    const el = await fixture
      (html`<attrs-test-2></attrs-test-2>`);

    el.setAttribute('name', 'test');

    await nextFrame();

    let div = el.shadowRoot.firstElementChild;
    expect(div.textContent).to.equal('test test');
  });

  it('observed attribute names turn into camelCase props', async () => {
    const tag = 'attrs-camelcase-test';
    let el;

    interface Props {
      'open': boolean;
      'open-a': boolean;
      'open-b-b': boolean;
      'openc-': boolean;
      'open-d': boolean;
      'open-ee': boolean;
      'open--fff': boolean;
    }

    function Drawer(element) {
      el = element;
      return html`Test`;
    }

    customElements.define(
      tag,
      component<HTMLElement & Props>(Drawer, {observedAttributes: [
        'open',
        'open-a',
        'open-b-b',
        'openc-',
        'open-d',
        'open-ee',
        'open--fff'
      ]})
    );

    await fixture
    (html`
      <attrs-camelcase-test
        open
        open-a
        open-b-b
        openc-
        open-d
        open-ee
        open--fff
      ></attrs-camelcase-test>`) as HTMLElement & Props;


    await nextFrame();

    expect(el.open).to.be.true;
    expect(el.openA).to.be.true;
    expect(el.openBB).to.be.true;
    expect(el.openc).to.be.true;
    expect(el.openD).to.be.true;
    expect(el.openEe).to.be.true;
    expect(el.openFff).to.be.true;
  });

})
