import { component, html, useRef, useState } from "../src/haunted.js";
import { fixture, expect, nextFrame } from "@open-wc/testing";

describe("useRef", () => {
  it("always returns the same object", async () => {
    const tag = "use-ref-test";
    let countRef;
    let requestRender;
    let timesRendered = 0;
    function app() {
      timesRendered++;
      countRef = useRef(0);
      [, requestRender] = useState(0);

      return html`Test`;
    }
    customElements.define(tag, component(app));

    await fixture<HTMLElement>(html`<use-ref-test></use-ref-test>`);

    expect(countRef.current).to.equal(0);
    countRef.current++;
    requestRender();
    await nextFrame();
    expect(timesRendered).to.equal(2);
    expect(countRef.current).to.equal(1);
  });
});
