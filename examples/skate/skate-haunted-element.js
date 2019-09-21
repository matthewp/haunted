import { withComponent } from 'https://unpkg.com/skatejs@5.2.4/dist/esnext/index.js';
import  withPreact from 'https://unpkg.com/@skatejs/renderer-preact@0.3.3/dist/esnext/index.js?module';
import htm from 'https://unpkg.com/htm@2.2.1/dist/htm.mjs';
import { h } from 'https://unpkg.com/preact@^8.2.5?module';
import { State } from '../../haunted.js';

export const html = htm.bind(h);

const Base = withComponent(withPreact());

export default class extends Base {
  constructor() {
    super();
    this.haunted = new State(() => this.triggerUpdate());
  }

  renderer(...args) {
    this.haunted.run(() => super.renderer(...args));
  }
}