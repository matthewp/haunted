import { component, html } from '../haunted.js';
import { attach, later, cycle } from './helpers.js';

describe('Passing props', () => {
  it('Are passed in the initial render', async () => {
    const tag = 'props-first-run-test';
    let runs = 0;

    function child({ prop }) {
      assert.equal(prop.id, 1);
      runs++;
      return html`testing ${prop.id}`;
    }

    customElements.define(tag + '-child', component(child));

    function app() {
      return html`
        <props-first-run-test-child .prop=${{ id: 1 }}>
        </props-first-run-test-child>
      `;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await later();

    assert.equal(runs, 1, 'child only ran once');
    teardown();
  });

  it('Only update if prop value changed', async () => {
    const tag = 'only-update-if-prop-value-changed';
    let runs = 0;

    function app({ prop }) {
      assert.equal(prop, 1);
      runs++;
      return html`testing ${prop}`;
    }

    customElements.define(tag, component(app));

    const { el, teardown } = attachAndSetProp(tag, 1);
    await cycle();

    // Set prop to the exact same value. It shouldn't call app() again
    // b/c there's no need to re-generate the template
    el.prop = 1;

    await later();

    assert.equal(runs, 1, 'ran only once b/c prop did not change');
    teardown();

    function attachAndSetProp(element, propValue) {
      let el = document.createElement(element);
      el.prop = propValue;
      host.appendChild(el);
      return {
        teardown: () => host.removeChild(el),
        el,
      };
    }
  });
});