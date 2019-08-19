import { useState } from '../../haunted.js';
import SkateHauntedElement, { html } from './skate-haunted-element.js';

class MyElement extends SkateHauntedElement {
  render() {
    const [count, setCount] = useState(0);

    return html`
      <div>
        <p>A paragraph</p>
        <button type="button" onClick=${() => setCount(count + 1)}>Increment</button>
        
        <p><strong>Count:</strong> ${count}</p>
      </div>
    `;
  }
}

customElements.define('my-element', MyElement);