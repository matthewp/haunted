import { component, html } from "../src/haunted.js";
import { fixture, expect } from "@open-wc/testing";

describe("component()", () => {
  it("works", async () => {
    customElements.define(
      "exports-test",
      component(() => {
        return html`Test`;
      })
    );

    const el = await fixture(html`<exports-test></exports-test>`);

    expect(el.shadowRoot.firstChild.nextSibling.nodeValue).to.equal("Test");
  });

  it("Is an instance of HTMLElement", () => {
    const tag = "component-instanceof";
    customElements.define(
      tag,
      component(() => {
        return html`Test`;
      })
    );

    const el = document.createElement(tag);
    expect(el instanceof HTMLElement).to.be.true;
  });
});
