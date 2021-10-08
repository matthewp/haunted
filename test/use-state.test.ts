import { component, html, useState } from '../src/haunted.js';
import { fixture, expect, nextFrame } from '@open-wc/testing';

describe('useState', () => {
  it('Lazy callback', async () => {
    const tag = 'use-state-callback';
    let setter;

    function App() {
      let [age, setAge] = useState(() => 8);
      setter = setAge;
      return html`<span>${age}</span>`;
    }

    customElements.define(tag, component(App));

    const el = await fixture<HTMLElement>(html`<use-state-callback></use-state-callback>`);

    let span = el.shadowRoot.firstElementChild;
    expect(span.textContent).to.equal('8');

    setter(33);

    await nextFrame();
    expect(span.textContent).to.equal('33');
  });
});
