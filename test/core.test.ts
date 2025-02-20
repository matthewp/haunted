import haunted, { useState } from "../src/core.js";
import { fixture, expect } from "@open-wc/testing";

// This is just to get the lit-html export for testing.
import { html, render } from "../src/haunted";

describe("haunted/core", () => {
  describe("Building", () => {
    it("Can be used to build haunteds", async () => {
      const tag = "custom-haunted-test";

      const { component } = haunted({
        render(what, where) {
          render(what, where);
        },
      });

      function App() {
        const [name] = useState("Matthew");
        return html`<span>Test-${name}</span>`;
      }

      customElements.define(tag, component(App));
      const el = await fixture(
        html`<custom-haunted-test></custom-haunted-test>`
      );

      expect(el.shadowRoot.textContent).to.equal("Test-Matthew");
    });
  });
});
