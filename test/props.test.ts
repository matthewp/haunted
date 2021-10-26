import { component, html } from '../src/haunted.js';
import { later } from './helpers.js';
import { fixture, expect, nextFrame } from '@open-wc/testing';

interface TestProps {
  prop: unknown;
}

describe('Passing props', () => {
  it('Are passed in the initial render', async () => {
    const tag = 'props-first-run-test';
    let runs = 0;

    function Child({ prop }) {
      expect(prop.id).to.equal(1);
      runs++;
      return html`testing ${prop.id}`;
    }

    customElements.define(tag + '-child',
        component<HTMLElement & TestProps>(Child));

    function App() {
      return html`
        <props-first-run-test-child .prop=${{ id: 1 }}>
        </props-first-run-test-child>
      `;
    }
    customElements.define(tag, component(App));

    await fixture(html`<props-first-run-test></props-first-run-test>`);
    await later();

    expect(runs).to.equal(1);
  });

  it('Only update if prop value changed', async () => {
    const tag = 'only-update-if-prop-value-changed';
    let runs = 0;

    function App({ prop }) {
      expect(prop).to.equal(1);
      runs++;
      return html`testing ${prop}`;
    }

    customElements.define(tag, component<HTMLElement & TestProps>(App));

    const { el, teardown } = attachAndSetProp(tag, 1);
    await nextFrame();

    // Set prop to the exact same value. It shouldn't call app() again
    // b/c there's no need to re-generate the template
    el.prop = 1;

    await later();

    expect(runs).to.equal(1);
    teardown();

    function attachAndSetProp(element: string, propValue: unknown) {
      let el = document.createElement(element) as HTMLElement & TestProps;
      el.prop = propValue;
      document.body.appendChild(el);
      return {
        teardown: () => document.body.removeChild(el),
        el,
      };
    }
  });

  it('"this" can be HTMLElement with Props intersection', async () => {
    function App(this: HTMLElement, { prop }) {
      expect(this instanceof HTMLElement).to.be.true;
      return html`testing this`;
    }
    customElements.define('this-intersection-element', component<HTMLElement & TestProps>(App));
    await fixture(html`<this-intersection-element></this-intersection-element>`);
  });

  it('"this" can be interface that extends HTMLElement', async () => {
    interface AppNProps extends HTMLElement {
      prop: number;
    }

    function App(this: AppNProps, { prop = 1 }) {
      expect(prop).to.equal(1);
      expect(this instanceof HTMLElement).to.be.true;
      return html`testing this`;
    }
    customElements.define('this-extends-element', component<AppNProps>(App));
    await fixture(html`<this-extends-element></this-extends-element>`);
  });
});
