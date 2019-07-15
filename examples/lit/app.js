import { html } from 'https://unpkg.com/lit-element@2.2.0/lit-element.js?module';
import { useState } from '../../haunted.js';
import LitHauntedElement, { litHaunted } from './lit-haunted-element.js';

class ClickElement extends LitHauntedElement {
  render() {
    const colors = [ 'BlanchedAlmond', 'tomato', 'DarkViolet', 'DarkTurquoise', 'SeaGreen' ];
    const [color, setColor] = useState(colors[0]);

    const randomColor = () => {
      let newColor = colors[Math.floor(Math.random()*colors.length)];
      setColor(newColor);
    };

    const onClick = () => {
      randomColor();
      this.dispatchEvent(new CustomEvent('increment'));
    };

    return html`
      <button type="button" @click=${onClick} style=${`background: ${color};`}>Increment</button>
    `;
  }
}

customElements.define('click-element', ClickElement);


function App() {
  const [count, setCount] = useState(0);

  return html`
    <p>A paragraph</p>
    <click-element @increment=${() => setCount(count + 1)}></click-element>
    
    <p><strong>Count:</strong> ${count}</p>
  `;
}

const MyElement = litHaunted(App);

customElements.define('my-element', MyElement);
