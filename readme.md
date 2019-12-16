# Haunted 🦇 🎃

[![npm](https://img.shields.io/npm/dt/haunted)](https://npm.im/haunted)
[![npm](https://img.shields.io/npm/v/haunted)](https://npm.im/haunted)

React's Hooks API but for standard web components and [lit-html](https://lit-html.polymer-project.org/) or [hyperHTML](https://codepen.io/WebReflection/pen/pxXrdy?editors=0010).

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
<script src="https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js"></script> 
```

For a full example with Internet Explorer 11, see - https://github.com/crisward/haunted-ie11

You can also use Custom Elements without Shadow DOM if you wish.
eg.

```js
component(() => html`...`, { useShadowDOM: false }));
```

### Importing

__Haunted__ can be imported just like any other library when using a bundler of your choice:

```js
import { component, html, useState } from 'haunted';
```

The main entry point is intended for [lit-html](https://github.com/Polymer/lit-html) users.

#### lighterhtml, etc

If you are using [lighterhtml](https://github.com/WebReflection/lighterhtml) or [hyperHTML](https://github.com/WebReflection/hyperHTML) then instead import `haunted/core`. This export gives you a function that creates Hooks that work with any template library.

```js
import haunted, { useState } from 'haunted/core';
import { html, render } from 'lighterhtml';

const { component } = haunted({
  render(what, where) {
    render(where, () => what);
  }
});

const App = component(() => {
  const [count, setCount] = useState(0);
  return html`Using lighterhtml! Count: ${count}`;
});
```

#### Web modules

__Haunted__ can work directly in the browser without using any build tools. Simply import the `haunted.js` bundle. You can use the [unpkg] or [pika](https://www.pika.dev/cdn) CDNs. This works great for demo pages and small apps. Here's an example with unpkg:

```js
import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component, useState, useEffect } from 'https://unpkg.com/haunted/haunted.js';
```

If using pika then use the `html` export from Haunted, as pika bundles everything together:

```js
import { useState, component, html } from 'https://cdn.pika.dev/haunted';
```

If you install Haunted __locally__ this build is located at `node_modules/haunted/haunted.js`.

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

const App = ({ name }) => {
  return html`Hello ${name}!`;
};

customElements.define('my-app', component(App));
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

customElements.define('hello-app', component(App));
```

Alternatively, you can pass `observedAttributes` as an option to `component()`:

```js
customElements.define('hello-app', component(App, {observedAttributes: ['name']}));
```

Which allows you to author (in HTML):

```html
<hello-app name="world"></hello-app>
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

Additionally you can provide a function as the argument to useState, in which case the function is called to initialize the first state, but never called again.

```js
const [count, setCount] = useState(() => {
  return expensiveFunction();
});
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

#### useLayoutEffect

The function signature is the same as `useEffect`, but the callback is being called synchronously after rendering. Updates scheduled inside `useLayoutEffect` will therefore be flushed synchronously, before the browser has a chance to paint.

Most of time, it is preferable to use `useEffect` to avoid blocking visual updates.

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

#### useRef

Create and returns an object with one property "current" which can be assigned any value and is unaffected by multiple renders.

```html
<!doctype html>

<my-app></my-app>

<script type="module">
  import { html } from 'https://unpkg.com/lit-html/lit-html.js';
  import { component, useRef } from 'https://unpkg.com/haunted/haunted.js';

  function App() {
    const myRef = useRef(0);

    return html`
      ${myRef.current}
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

Most functionality can be achieved with the provided hooks above, but you can also create your own hooks for custom functionality like so:

```js
import { hook, Hook } from 'haunted';

const useMyHook = hook(class extends Hook {
  constructor(id, state) {
    super(id, state);
    ...
  }

  update() { ... }

  teardown() { ... }

});
```

### State

At its heart, Haunted is a container for state derived from hooks. The `component` and `virtual` signatures build on top of this state container.

In order to use Haunted outside of its component types, such as to extend another custom element base class, you can use the `State` constructor.

It has a signature of: `new State(update, [ hostElement ])`.

> Note that the second argument `hostElement` is optional. If you want to use the `useContext` hook you will need to provide a host element, however.

Here's an example how it can be used to run hooks code:

```js
import { State, useState } from 'haunted';

let state = new State(() => {
  update();
});

function update() {
  state.run(() => {
    const [count, setCount] = useState(0);

    console.log('count is', count);

    setTimeout(() => setCount(count + 1), 3000);
  });
}

update();
```

The above will result in the count being incremented every 3 seconds and the current count being logged.

A more practical example is integration with a custom element base class. Here's a simple integration with [LitElement](https://lit-element.polymer-project.org/):

```js
import { LitElement } from 'lit-element';
import { State } from 'haunted';

export default class LitHauntedElement extends LitElement {
  constructor() {
    super();

    this.hauntedState = new State(() => this.requestUpdate(), this);
  }

  update(changedProperties) {
    this.hauntedState.run(() => super.update(changedProperties));
    this.hauntedState.runEffects();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.hauntedState.teardown();
  }
}
```

More example integrations can be found in [this gist](https://gist.github.com/matthewp/92c4daa6588eaef484c6f389d20d5700).

### Function Signatures

`component(renderer, options): Element`
`component(renderer, BaseElement, options): Element`
- renderer = ``` (element) => html`...` ```  
- BaseElement = `HTMLElement`
- options = `{baseElement: HTMLElement, observedAttributes: [], useShadowDOM: true}`

`virtual(renderer): directive`
- renderer = ``` (element) => html`...` ```  

## License

BSD-2-Clause
