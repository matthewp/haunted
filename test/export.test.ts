import { component, html } from '../haunted.js';
import { attach, cycle } from './helpers.js';

describe('component()', () => {
  it('works', async () => {
    customElements.define('exports-test', component(() => {
      return html`Test`;
    }));

    let teardown = attach('exports-test');
    await cycle();

    assert.equal(host.firstChild.shadowRoot.firstChild.nextSibling.nodeValue, 'Test', 'Rendered');
    teardown();
  });

  it('Is an instance of HTMLElement', () => {
    const tag = 'component-instanceof';
    customElements.define(tag, component(() => {
      return html`Test`;
    }));

    const el = document.createElement(tag);
    assert.ok(el instanceof HTMLElement, 'Is an HTMLElement');
  });
});
