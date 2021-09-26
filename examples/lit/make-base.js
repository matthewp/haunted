import { LitElement } from 'https://unpkg.com/lit?module';
import { State } from '../../haunted.js';

export default function(renderer) {
  return class extends LitElement {
    static get properties() {
      return renderer.observedAttributes || [];
    }

    createRenderRoot() {
      return this.attachShadow({mode: "open"});
    }

    constructor() {
      super();
      this.haunted = new State(renderer, () => this.update());
    }

    render() {
      return this.haunted.render();
    }

    updated(_changedProperties) {
      this.haunted.runEffects();
      super.updated(_changedProperties);
    }

    disconnectedCallback() {
      this.haunted.teardown();
      super.disconnectedCallback();
    }
  }
}
