import {
  component,
  html,
  useLayoutEffect,
  useEffect,
  useState,
} from "../src/haunted.js";
import { fixture, fixtureCleanup, expect, nextFrame } from "@open-wc/testing";

describe("useLayoutEffect", () => {
  it("Is called", async () => {
    const tag = "call-layout-effect-test";
    let ran = false;

    function app() {
      useLayoutEffect(() => {
        ran = true;
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    await fixture(html`<call-layout-effect-test></call-layout-effect-test>`);

    expect(ran).to.be.true;
  });

  it("Is called before useEffect", async () => {
    const tag = "order-effects-test";
    let effects = true;

    function app() {
      useEffect(() => {
        effects = true;
      });

      useLayoutEffect(() => {
        effects = false;
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    await fixture(html`<order-effects-test></order-effects-test>`);

    expect(effects).to.be.true;
  });

  it("Memoizes values", async () => {
    const tag = "memo-layout-effect-test";
    let effects = 0;
    let set;

    function app() {
      let [, setVal] = useState(0);
      set = setVal;

      useLayoutEffect(() => {
        effects++;
      }, [1]);

      return html`Test`;
    }
    customElements.define(tag, component(app));

    await fixture(html`<memo-layout-effect-test></memo-layout-effect-test>`);

    set(2);
    await nextFrame();

    expect(effects).to.equal(1);
  });

  it("Can teardown subscriptions", async () => {
    const tag = "teardown-layout-effect-test";
    let subs = [];
    let set;

    function app() {
      let [val, setVal] = useState(0);
      set = setVal;

      useLayoutEffect(() => {
        subs.push(val);
        return () => {
          subs.splice(subs.indexOf(val), 1);
        };
      });

      return html`Test`;
    }
    customElements.define(tag, component(app));

    await fixture(
      html`<teardown-layout-effect-test></teardown-layout-effect-test>`
    );

    set(1);
    await nextFrame();

    set(2);
    await nextFrame();

    expect(subs.length).to.equal(1);
  });

  it("Tears-down on unmount", async () => {
    const tag = "teardown-layout-effect-unmount-test";
    let subs = [];

    function app() {
      let val = Math.random();

      useLayoutEffect(() => {
        subs.push(val);
        return () => {
          subs.splice(subs.indexOf(val), 1);
        };
      });

      return html`Test`;
    }

    customElements.define(tag, component(app));

    await fixture(
      html`<teardown-layout-effect-unmount-test></teardown-layout-effect-unmount-test>`
    );
    fixtureCleanup();

    expect(subs.length).to.equal(0);
  });

  it("useLayoutEffect(fn) runs the effect after each render", async () => {
    const tag = "no-values-layout-effect-test";
    let calls = 0;

    function App() {
      useLayoutEffect(() => {
        calls++;
      });
    }

    customElements.define(tag, component(App));
    await fixture(
      html`<no-values-layout-effect-test></no-values-layout-effect-test>`
    );

    expect(calls).to.equal(1);

    (document.querySelector(tag) as any).prop = "foo";
    await nextFrame();
    expect(calls).to.equal(2);
  });

  it("useLayoutEffect(fn, []) runs the effect only once", async () => {
    const tag = "empty-array-layout-effect-test";
    let calls = 0;

    function App() {
      useLayoutEffect(() => {
        calls++;
      }, []);
    }

    customElements.define(tag, component(App));
    await fixture(
      html`<empty-array-layout-effect-test></empty-array-layout-effect-test>`
    );

    expect(calls).to.equal(1);

    (document.querySelector(tag) as any).prop = "foo";
    await nextFrame();
    expect(calls).to.equal(1);
  });
});
