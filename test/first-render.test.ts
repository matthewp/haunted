import { component, html } from '../src/haunted.js';
import { fixture, expect } from '@open-wc/testing';

describe('First Render', () => {
  it('should clear content', async () => {
    customElements.define('no-shadow-test', component(() => {
      return html`Template Content`;
    }, HTMLElement, {useShadowDOM: false}));

    // This "Loading..." text should be cleared after first render
    const el = await fixture<HTMLElement>(html`<no-shadow-test>Loading...</no-shadow-test>`);

    expect(el.innerText).to.equal('Template Content');
  });
})
