import { component, html, render, useState, useEffect, useLayoutEffect, virtual } from '../src/haunted.js';
import { fixture, expect, nextFrame } from '@open-wc/testing';

describe('virtual()', () => {
  it('Creates virtual components', async () => {
    let el = document.createElement('div');
    let set;

    const App = virtual(() => {
      const [count, setCount] = useState(0);
      set = setCount;

      return html`<span>${count}</span>`
    });

    render(App(), el);

    await nextFrame();
    expect(el.firstElementChild.textContent).to.equal('0');

    set(1);
    await nextFrame();
    expect(el.firstElementChild.textContent).to.equal('1');
  });

  it('Conditionally renders virtual components in the same part of a template', async () => {
    let el = document.createElement('div');
    let set;

    const virtual1 = virtual(() => html`v1`);
    const virtual2 = virtual(() => html`v2`);

    const App = virtual(() => {
      const [condition, setCondition] = useState(true);
      set = setCondition;

      return html`<button>${condition ? virtual1() : virtual2()}</button>`;
    });

    render(App(), el);

    await nextFrame();
    expect(el.firstElementChild.textContent).to.equal('v1');

    set(false);
    await nextFrame();
    expect(el.firstElementChild.textContent).to.equal('v2');

  });

  it('Rendering children doesn\'t rerender the parent', async () => {
    let el = document.createElement('div');
    let set;

    let childRenders = 0;
    const Child = virtual(() => {
      childRenders++;
      const [count, setCount] = useState(0);
      set = setCount;
      return html`<span id="count">${count}</span>`;
    });

    let parentRenders = 0;
    const Parent = virtual(() => {
      parentRenders++;

      return html`
        <section>${Child()}</section>
      `;
    });

    render(Parent(), el);

    await nextFrame();

    expect(parentRenders).to.equal(1);
    expect(childRenders).to.equal(1);

    set(1);
    await nextFrame();

    expect(parentRenders).to.equal(1);
    expect(childRenders).to.equal(2);

    let span = el.firstElementChild.firstElementChild;
    expect(span.textContent).to.equal("1");
  });

  it('Parent can pass args to the child', async () => {
    let el = document.createElement('div');

    const Child = virtual((foo, baz) => {
      return html`<span>${foo}-${baz}</span>`;
    });

    const Parent = virtual(() => {
      return html`
        <section>${Child('bar', 'qux')}</section>
      `;
    });

    render(Parent(), el);

    await nextFrame();
    let span = el.firstElementChild.firstElementChild;
    expect(span.textContent).to.equal('bar-qux');
  });

  it('Rerender parent doesn\'t create a new child', async () => {
    let el = document.createElement('div');
    let setParent, setChild;

    const Child = () => {
      const [count, setCount] = useState(0);
      setChild = setCount;

      return html`<span>${count}</span>`;
    };

    const Parent = virtual(() => {
      const [, set] = useState('');
      setParent = set;
      return html`<div>${virtual(Child)()}</div>`;
    });

    render(Parent(), el);

    await nextFrame();

    // Change the child's state.
    setChild(1);

    await nextFrame();
    setParent('foo');

    await nextFrame();

    let span = el.firstElementChild.firstElementChild;
    expect(span.textContent).to.equal('1');
  });

  it('Can use effects', async () => {
    let effect = false;
    const App = virtual(() => {
      useEffect(() => {
        effect = true;
      });
    });

    let el = document.createElement('div');
    render(App(), el);

    await nextFrame();
    expect(effect).to.equal(true);
  });

  it('Can use layout effects', async () => {
    let effect = false;
    const App = virtual(() => {
      useLayoutEffect(() => {
        effect = true;
      });
    });

    let el = document.createElement('div');
    render(App(), el);

    await nextFrame();
    expect(effect).to.equal(true);
  });

  it('Teardown is invoked', async () => {
    const tag = 'app-with-virtual-teardown';
    let teardownCalled = 0;
    let set;

    const Counter = () => {
      useEffect(() => {
        return () => {
          teardownCalled++;
        };
      }, []);
      return html`<div>STUFF</div>`;
    };

    const Main = () => {
      const [show2, toggle2] = useState(true);
      set = toggle2;
      return html`
        Virtual:
        ${show2 ? virtual(Counter)() : undefined}
      `;
    };

    customElements.define(tag, component(Main));

    await fixture<HTMLElement>(html`<app-with-virtual-teardown></app-with-virtual-teardown>`);

    set(false);
    await nextFrame();

    expect(teardownCalled).to.equal(1);
  });
});
