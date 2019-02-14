import { component, html, hook, Hook } from '../web.js';
import { attach, cycle } from './helpers.js';

let constructorRan = false;
let updateRan = false;
let teardownRan = false;

const useCustomHook = hook(class extends Hook {
  constructor(id, el) {
    super(id, el);
    constructorRan = true;
  }

  update() {
    updateRan = true;
    return 'just a test';
  }

  teardown() {
    teardownRan = true;
  }

});

describe('custom hook', () => {
  it('can use all hook lifecycle methods', async () => {
    const tag = 'custom-hook-test';
    let cnt;

    function app() {
      const val = useCustomHook();
      return html`${val}`;
    }
    customElements.define(tag, component(app));

    const teardown = attach(tag);
    await cycle();
    teardown();

    assert.equal(constructorRan, true, 'constructor ran');
    assert.equal(updateRan, true, 'update ran');
    assert.equal(teardownRan, true, 'teardown ran');
  });
});
