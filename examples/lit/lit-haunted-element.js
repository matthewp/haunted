import { LitElement } from 'https://unpkg.com/lit-element@2.2.0/lit-element.js?module';
import { State } from '../../haunted.js';

export default class LitHauntedElement extends LitElement {
  constructor() {
    super();

    this.haunted = new State(() => this.requestUpdate());
  }

  update(changedProperties) {
    this.haunted.run(() => super.update(changedProperties));
  }
}

export const litHaunted = (renderer) => {
  return class extends LitHauntedElement {
    render() {
      return renderer.call(this, this);
    }
  }
};