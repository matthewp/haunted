# Guides >> TypeScript || 50

Haunted is written in TypeScript and should work quite well with existing TS projects.

There are some tricks to defining custom elements in strict type projects that can help.

## Properties & Attributes

First, if no properties or attributes are being used, nothing is needed. This will work just fine:

```js
customElements.define('my-app', component(App));
```

When properties are used, you can specify an intersection type of `HTMLElement` and your component properties as a generic for `component`:

```js
interface AppProps {
  userData: UserData;
}

function App({ userData }: AppProps) {
  return html`
    <img src=${userData.portrait} alt="user portait" />
    <p>${userData.name}</p>
  `;
}

customElements.define('my-app', component<HTMLElement & AppProps>(App));
```

Alternatively, you can extend your Props from HTMLElement:

```js
interface FigurePlusProps extends HTMLElement {
  userData: UserData;
}

function Figure({ userData }: FigurePlusProps) {
  return html`
    <img src=${userData.portrait} alt="user portait" />
    <p>${userData.name}</p>
  `;
}

customElements.define('my-figure', component<FigurePlusProps>(Figure));
```


Finally, when using component attributes, TypeScript will complain when attempting to add `observedAttributes` using dot or bracket notation value assignments. Instead, pass them into the `component` function as a second argument:

```js
interface AppProps {
  firstName: string;
}

function App({ firstName }) {
  return `Hello ${firstName}!`;
}

customElements.define('my-app', component<HTMLElement & AppProps>(App, { observedAttributes: ['first-name'] }));
```

## Using custom elements dynamically

There are circumstances where you might want to use TypeScript to modify your Haunted custom element property values. For instance:

```js
const profile = document.createElement('my-app');
profile.firstName = 'Mortimer';
```

If `my-app` is not defined on the `HTMLElementTagNameMap`, TypeScript will rightly complain that `firstName` is not a valid property of `HTMLElement`.

You will need to add the type of your component to the [Document Interface](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html#the-document-interface) to fix this.

```js
declare global {
  interface HTMLElementTagNameMap {
    'my-app': HTMLElement & MyAppProps,
  }
}
```

## Using `this` in component definition functions

If you need to use `this` in your custom element, you can describe it as an
HTMLElement or a shape that extends an HTMLElement.

```js
function List(this: HTMLElement, { items }: { items: { id: string, name: string }[] }) {
  const handleListItemSelect = (id: string) => () => {
    this.dispatchEvent(
      new CustomEvent("item-change", {
        bubbles: true,
        composed: true,
        detail: { id }
      })
    );
  };
```
