import { component, html, hook, Hook } from '../src/haunted.js';
import { State } from '../src/state.js';
import { fixture, fixtureCleanup, expect } from '@open-wc/testing';

let constructorRan = false;
let updateRan = false;
let teardownRan = false;

const useCustomHook = hook(class extends Hook {
  constructor(id: number, el: State) {
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

    function App() {
      const val = useCustomHook();
      return html`${val}`;
    }
    customElements.define(tag, component(App));

    await fixture(html`<custom-hook-test></custom-hook-test>`);

    fixtureCleanup();
    expect(constructorRan).to.be.true;
    expect(updateRan).to.be.true;
    expect(teardownRan).to.be.true;
  });
});
