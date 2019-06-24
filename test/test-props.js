import { component, html } from '../haunted.js';
import { attach, later } from './helpers.js';

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
        <props-first-run-test-child .prop=${{id:1}}>
        </props-first-run-test-child>
      `;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await later();
    
    assert.equal(runs, 1, 'child only ran once');
    teardown();
  });
});