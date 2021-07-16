# Guides >> API || 25

Haunted is all about writing plain functions that can contain their own state. The documentation below is separated into two sections: creating _components_ (the functions) and using _hooks_ to manage state.

## Components

Components are functions that contain state and return HTML via lit-html or hyperHTML. Through the `component()` and `virtual()` they become connected to a lifecycle that keeps the HTML up-to-date when state changes.

Using Haunted you can create custom elements or _virtual_ components (components that contain state but have no element tag).

## Custom elements

A custom element can be defined via haunted by passing your component you defined (e.g. `function App() {}`) to haunted's `component` function. You then take the result of your call to `component` and pass it to `customElements.define` like so:

```js
function App({ name }) {
  return html`Hello ${name}`;
}

customElements.define('my-app', component(App));
```

You can now use `<my-app></my-app>` anywhere you use HTML (directly in a `.html` file, in JSX, in lit-html templates, wherever).

### Brief Digression:

Another way to write your component is with the arrow function syntax, or fat arrow. It offers a more concise and clean way to write your code, however, it does come with one drawback:

There's no way to use the `this` keyword to refer to the instance of your web component that is running.

```js
const App = ({ name }) => {
  console.log(this); // => 'undefined'
  return html`Hello ${name}!`;
};
```

However, you can get the element instance as the first parameter.

```js
const App = element => {
  console.log(element); // => HTMLElement
  const { name } = element;
  return html`Hello ${name}!`;
};
```

## Rendering

Now that we have access to `<my-app>` anywhere we can write HTML, what if you want to render it from JavaScript?

In this instance, we're using lit-html which comes with a `render` function. You can utilize it by passing in your HTML template and the element you wish to render the template into:

```js
import { render, html } from 'lit-html';

render(
  html`<my-app name="world"></my-app>`,
  document.body
);
```
