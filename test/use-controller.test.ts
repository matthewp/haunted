import { component, html, useController } from '../src/haunted.js';
import { fixture, expect } from '@open-wc/testing';

describe('useController', () => {

  describe('with simple controller', async () => {
    class SimpleController {
      text = 'x';

      constructor(public host, public laterText: string) {
        host.addController(this);
      }

      hostConnected() {
        setTimeout(() => {
          this.text = 'y'
          this.host.requestUpdate()
          setTimeout(() => {
            this.text = this.laterText;
            this.host.requestUpdate()
          }, 10);
        }, 10);
      }
    }

    const useSimple = (text: string) => useController(
        host => new SimpleController(host, text));

    const tag = 'use-controller-callback';

    function App() {
      let { text } = useSimple('a');
      return html`<span>${text}</span>`;
    }

    customElements.define(tag, component(App));

    const el = await fixture<HTMLElement>(
        html`<use-controller-callback></use-controller-callback>`);
    const span = el.shadowRoot.firstElementChild;


    it('shows first controller value immediately', ()=> {
      expect(span.textContent).to.equal('x');
    });

    it('updates to 2nd controller value after 10ms', async ()=> {
      await new Promise(r => setTimeout(r, 10));
      expect(span.textContent).to.equal('y');
    });

    it('shows user-provided value after 20ms', async ()=> {
      await new Promise(r => setTimeout(r, 20));
      expect(span.textContent).to.equal('a');
    });
  });
});
