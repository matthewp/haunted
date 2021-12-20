# Guides >> Attributes || 20

<style data-helmet>
  html { --playground-ide-height: 210px; }
</style>

In custom elements, attributes must be pre-defined. To define what attributes your component supports, set the `observedAttributes` property on the function you defined. Note that attributes use kebab case in templates and are converted into camel case for use in your component's code.

```js playground attributes my-app.js
import { component } from 'haunted';
function App({ firstName }) {
  return `Hello ${firstName}!`;
}

App.observedAttributes = ['first-name'];

customElements.define('my-app', component(App));
```

Alternatively, you can pass `observedAttributes` as an option to `component()`:

```js
import { component } from 'haunted';
function App({ firstName }) {
  return `Hello ${firstName}!`;
}

customElements.define('my-alt', component(App, { observedAttributes: ['first-name'] }));
```

Once your custom element is defined you can then pass in attributes as you would with any other HTML element. Just like any other HTML attribute **only strings are accepted**, anything else will be converted into a string.

```html
<my-app first-name="World"></my-app>
```

```html playground-file attributes index.html
<my-app first-name="World"></my-app>
<my-alt first-name="Friends"></my-alt>
<!-- playground-hide -->
<script type="module" src="my-app.js"></script>
<script type="module" src="my-alt.js"></script>
<!-- playground-hide-end -->
```

```js playground-file attributes my-alt.js
import { component } from 'haunted';
function App({ firstName }) {
  return `Hello ${firstName}!`;
}

App.observedAttributes = ['first-name'];

customElements.define('my-alt', component(App, { observedAttributes: ['first-name'] }));
```
