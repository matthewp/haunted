import { component, html, render, useState, useEffect, useLayoutEffect, virtual } from '../haunted.js';
import { attach, cycle } from './helpers.js';

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

    await cycle();
    assert.equal(el.firstElementChild.textContent, '0');

    set(1);
    await cycle();
    assert.equal(el.firstElementChild.textContent, '1');
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

    await cycle();

    assert.equal(parentRenders, 1);
    assert.equal(childRenders, 1);

    set(1);
    await cycle();

    assert.equal(parentRenders, 1);
    assert.equal(childRenders, 2);

    let span = el.firstElementChild.firstElementChild;
    assert.equal(span.textContent, "1");
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

    await cycle();
    await cycle();
    let span = el.firstElementChild.firstElementChild;
    assert.equal(span.textContent, 'bar-qux');
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

    await cycle();

    // Change the child's state.
    setChild(1);

    await cycle();
    setParent('foo');

    await cycle();
    await cycle();

    let span = el.firstElementChild.firstElementChild;
    assert.equal(span.textContent, '1');
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

    await cycle();
    assert.equal(effect, true, 'Effect ran within the virtual component');
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

    await cycle();
    assert.equal(effect, true, 'Layout effect ran within the virtual component');
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

    let teardown = attach(tag);
    await cycle();

    set(false);
    await cycle();
    teardown();

    assert.equal(teardownCalled, 1, 'Use effect teardown called');
  });
});
