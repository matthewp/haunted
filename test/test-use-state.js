import { component, html, useState } from '../haunted.js';
import { attach, cycle } from './helpers.js';

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

    const teardown = attach(tag);

    await cycle();
    let span = host.firstChild.shadowRoot.firstElementChild;
    assert.equal(span.textContent, '8', 'initial value');

    setter(33);

    await cycle();
    assert.equal(span.textContent, '33', 'updated value');

    teardown();
  });
});