# Guides >> TypeScript || 50

Haunted is written in TypeScript and should work quite well with existing TS projects.

There are some tricks to defining custom elements in strict type projects that can help.

First, if no properties or attributes are being used, nothing is needed. This will work just fine:

```js
customElements.define('my-profile', component(Profile));
```

When properties are used, you can specify an intersection type of `HTMLElement` and your component properties as a generic for `component`:

```js
interface FigureProps {
  userData: UserData;
}

function Figure({ userData }: FigureProps) {
  return html`
    <img src=${userData.portrait} alt="user portait" />
    <fig-caption>${userData.name}</fig-caption>
  `;
}

customElements.define('my-figure', component<HTMLElement & FigureProps>(Figure));
```

Alternatively, you can extend your Props from HTMLElement:

```js
interface FigurePlusProps extends HTMLElement {
  userData: UserData;
}

function Figure({ userData }: FigurePlusProps) {
  return html`
    <img src=${userData.portrait} alt="user portait" />
    <fig-caption>${userData.name}</fig-caption>
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

customElements.define('my-alt', component<HTMLElement & AppProps>(App, { observedAttributes: ['first-name'] }));
```
