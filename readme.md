# Haunted 🦇 🎃

React's Hooks API but for standard web components and [hyperHTML](https://codepen.io/WebReflection/pen/pxXrdy?editors=0010) or [lit-html](https://lit-html.polymer-project.org/). 

```html
<!doctype html>
<html lang="en">

<my-counter></my-counter>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useState } from 'https://unpkg.com/haunted/haunted.js';

  function Counter() {
    const [count, setCount] = useState(0);

    return html`
      <div id="count">${count}</div>
      <button type="button" @click=${() => setCount(count + 1)}>Increment</button>
    `;
  }

  customElements.define('my-counter', component(Counter));
</script>
```

## Getting started

A starter app is available on [codesandbox](https://codesandbox.io/s/github/matthewp/haunted-starter-app/tree/master/) and also can be cloned from [this repo](https://github.com/matthewp/haunted-starter-app). This app gives you the basics of how to use Haunted and build components.

## Use

```shell
npm install haunted
```
For Internet Explorer 11, you'll need to use a proxy polyfill, in addition to the usual webcomponentsjs polyfills. 
eg.
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js"></script> 
```
For a full example see - https://github.com/crisward/haunted-ie11

You can also use Custom Elements without Shadow DOM if you wish.
eg.
```
component(() => html`...`, HTMLElement, {useShadowDOM: false}))
```

### Builds

Haunted comes in a few builds. Pick one based on your chosen environment:

* __index.js__ is available for bundlers such as Webpack and Rollup. Use with: `import { useState } from 'haunted';`;
* __web.js__ is avaible for use with the web's native module support. Use with: `import { useState } from '../node_modules/haunted/web.js';`.
* __haunted.js__ is available via the CDN [unpkg](https://unpkg.com). This is great for small apps or for local development without having to install anything. Use with `import { useState } from 'https://unpkg.com/haunted/haunted.js';`

## API

Haunted is all about writing plain functions that can contain their own state. The follow docs is divided between creating *components* (the functions) and using *hooks* the state.

### Components

Components are functions that contain state and return HTML via lit-html or hyperHTML. Through the `component()` and `virtual()` they become connected to a lifecycle that keeps the HTML up-to-date when state changes.

Using Haunted you can create custom elements or *virtual* components (components that contain state but have no element tag).

#### Custom elements

The easiest way to create components is by importing `component` and creating a custom element like so:

```js
import { component } from 'haunted';
import { html } from 'lit-html';

const App = component(({ name }) => {
  return html`Hello ${name}!`;
});

customElements.define('my-app', App);
```

You can now use this anywhere you use HTML (directly in a `.html` file, in JSX, in lit-html templates, whereever).

Here's an example of rendering with lit-html the above app:

```js
import { render, html } from 'lit-html';

render(html`
  <my-app name="world"></my-app>
`, document.body);
```

##### Attributes

In custom elements, attributes must be pre-defined. Properties, on the other hand, do not. To define what attributes your component supports, set the `observedAttributes` property on the functional component. For example:

```js
const App = ({name}) => {
  return `Hello ${name}!`;
};

App.observedAttributes = ['name'];

customElements.define('hello-app', App);
```

Which allows you to author (in HTML):

```html
<hello-app name="world"></hello-app>
```

#### Configure component function to use different render engine

Swap version of lit-html:

```js
import {render, html} from "lit-html"
import {configureComponent} from "haunted/src/configure-component.js"
const component = configureComponent({render})
const App = component(() => {/*...*/})
```

Use lighterhtml instead:

```js
import {render, html} from "lighterhtml"
import {adaptLighterHtml} from "haunted/src/adapt-lighter-html.js"
import {configureComponent} from "haunted/src/configure-component.js"
const component = configureComponent({render: adaptLighterHtml(render)})
const App = component(() => {/*...*/})
```

#### Virtual components

Haunted also has the concept of *virtual components*. These are components that are not defined as a tag. Rather they are functions that can be called from within another template. They have their own state and will rerender when that state changes, *without* causing any parent components to rerender.

The following is an example of using virtual components:

```js
import { useState, virtual, component } from 'haunted';
import { html, render } from 'lit-html';

const Counter = virtual(() => {
  const [count, setCount] = useState(0);

  return html`
    <button type="button"
      @click=${() => setCount(count + 1)}>${count}</button>
  `;
});

const App = component(() => {
  return html`
    <main>
      <h1>My app</h1>

      ${Counter()}
    </main>
  `;
});

customElements.define('my-app', App);
```

Notice that we have `Counter`, a virtual component, and `App`, a custom element. You can use virtual components within custom elements and custom elements within virtual components.

The only difference is that custom elements are used by using their `<my-app>` tag name and virtual components are called as functions.

If you wanted you could create an entire app of virtual components.

### Hooks

Haunted supports the same API as React Hooks. The hope is that by doing so you can reuse hooks available on npm simply by aliasing package names in your bundler's config.

Currently Haunted supports the following hooks:

#### useState

Create a tuple of state and a function to change that state.

```js
const [count, setCount] = useState(0);
```

#### useEffect

Useful for side-effects that run after the render has been commited.

```html
<!doctype html>

<my-counter></my-counter>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useState, useEffect } from 'https://unpkg.com/haunted/haunted.js';

  function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      document.title = `Clicked ${count} times`;
    });

    return html`
      <div id="count">${count}</div>
      <button type="button" @click=${() => setCount(count + 1)}>Increment</button>
    `;
  }

  customElements.define('my-counter', component(Counter));
</script>
```

##### Memoization

Like `useMemo`, `useEffect` can take a second argument that are values that are memoized. The effect will only run when these values change.

```js
function App() {
  let [name, setName] = useState('Dracula');

  useEffect(() => {
    // This only occurs when name changes.
    document.title = `Hello ${name}`;
  }, [name]);

  return html`...`;
}
```

##### Cleaning up side-effects

Since effects are used for side-effectual things and might run many times in the lifecycle of a component, `useEffect` supports returning a teardown function.

An example of when you might use this is if you are setting up an event listener.

```js
function App() {
  let [name, setName] = useState('Wolf Man');

  useEffect(() => {
    function updateNameFromWorker(ev) {
      setName(ev.data);
    }

    worker.addEventListener('message', updateNameFromWorker);

    return () => {
      worker.removeEventListener('message', updateNameFromWorker);
    }
  });

  return html`...`;
}
```

#### useReducer

Create state that updates after being ran through a reducer function.

```html
<!doctype html>

<my-counter></my-counter>


<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useReducer } from 'https://unpkg.com/haunted/haunted.js';

  const initialState = {count: 0};

  function reducer(state, action) {
    switch (action.type) {
      case 'reset': return initialState;
      case 'increment': return {count: state.count + 1};
      case 'decrement': return {count: state.count - 1};
    }
  }

  function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return html`
      Count: ${state.count}
      <button @click=${() => dispatch({type: 'reset'})}>
        Reset
      </button>
      <button @click=${() => dispatch({type: 'increment'})}>+</button>
      <button @click=${() => dispatch({type: 'decrement'})}>-</button>
    `;
  }

  customElements.define('my-counter', component(Counter));
</script>
```

#### useMemo

Create a memoized state value. Only reruns the function when dependent values have changed.

```html
<!doctype html>

<my-app></my-app>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useMemo, useState } from 'https://unpkg.com/haunted/haunted.js';

  function fibonacci(num) {
    if (num <= 1) return 1;

    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  function App() {
    const [value, setVal] = useState(12);
    const fib = useMemo(() => fibonacci(value), [value]);

    return html`
      <h1>Fibonacci</h1>
      <input type="text" @change=${ev => setVal(Number(ev.target.value))} value="${value}">
      <div>Fibonacci <strong>${fib}</strong></div>
    `;
  }

  customElements.define('my-app', component(App));
</script>
```

#### useContext

Grabs context value from the closest provider up in the tree and updates component when value of a provider changes.
Limited only to "real" components for now.

```html
<!doctype html>

<my-app></my-app>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, createContext, useContext } from 'https://unpkg.com/haunted/haunted.js';

  const ThemeContext = createContext('dark');

  customElements.define('theme-provider', ThemeContext.Provider);
  customElements.define('theme-consumer', ThemeContext.Consumer);

  function Consumer() {
    const context = useContext(ThemeContext);

    return context;
  }

  customElements.define('my-consumer', component(Consumer));

  function App() {
    const [theme, setTheme] = useState('light');
    
    return html`
      <select value=${theme} @change=${(e) => setTheme(e.target.value)}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      
      <theme-provider .value=${theme}>
        
        <my-consumer></my-consumer>

        <!-- creates context with inverted theme -->
        <theme-provider .value=${theme === 'dark' ? 'light' : 'dark'}> 
          
          <theme-consumer
            .render=${value => html`<h1>${value}</h1>`}
          ></theme-consumer>
        
        </theme-provider>
      
      </theme-provider>
    `;
  }

  customElements.define('my-app', component(App));
</script>
```

#### Write Your Own Hook

Most functionality can be achieved with the provided hooks above, but you can also create your own hooks for custom functionality.

```html
import { hook, Hook } from 'haunted';

const useMyHook = hook(class extends Hook {
  constructor(id, el) {
    super(id, el);
    ...
  }

  update() { ... }

  teardown() { ... }

});
```

### Function Signatures

`component(renderer, BaseElement, options): Element`
- renderer = ``` (element) => html`...` ```  
- BaseElement = `HTMLElement`
- options = `{useShadowDOM: true}`

`virtual(renderer): directive`
- renderer = ``` (element) => html`...` ```  

## License

BSD-2-Clause
