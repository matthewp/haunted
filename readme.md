# Haunted 🦇 🎃

[![npm](https://img.shields.io/npm/dt/haunted)](https://npm.im/haunted)
[![npm](https://img.shields.io/npm/v/haunted)](https://npm.im/haunted)

React's Hooks API but for standard web components and [lit-html](https://lit-html.polymer-project.org/) or [hyperHTML](https://codepen.io/WebReflection/pen/pxXrdy?editors=0010).

📚 [Read the Docs](https://hauntedhooks.netlify.app) 📖

```html
<html lang="en">
  <my-counter></my-counter>

  <script type="module">
    import { html } from 'https://unpkg.com/lit?module';
    import { component, useState } from 'https://unpkg.com/haunted/haunted.js';

    function Counter() {
      const [count, setCount] = useState(0);

      return html`
        <div id="count">${count}</div>
        <button type="button" @click=${() => setCount(count + 1)}>
          Increment
        </button>
      `;
    }

    customElements.define('my-counter', component(Counter));
  </script>
</html>
```

More example integrations can be found in [this gist](https://gist.github.com/matthewp/92c4daa6588eaef484c6f389d20d5700).

## Hooks

Haunted supports the same API as React Hooks. The hope is that by doing so you can reuse hooks available on npm simply by aliasing package names in your bundler's config.

Currently Haunted supports the following hooks:

- [useCallback](https://hauntedhooks.netlify.app/docs/hooks/useCallback/)
- [useContext](https://hauntedhooks.netlify.app/docs/hooks/useContext/)
- [useController](https://hauntedhooks.netlify.app/docs/hooks/useController/)
- [useEffect](https://hauntedhooks.netlify.app/docs/hooks/useEffect/)
- [useLayoutEffect](https://hauntedhooks.netlify.app/docs/hooks/useLayoutEffect/)
- [useMemo](https://hauntedhooks.netlify.app/docs/hooks/useMemo/)
- [useProvideContext](https://hauntedhooks.netlify.app/docs/hooks/useProvideContext/)
- [useReducer](https://hauntedhooks.netlify.app/docs/hooks/useReducer/)
- [useRef](https://hauntedhooks.netlify.app/docs/hooks/useRef/)
- [useState](https://hauntedhooks.netlify.app/docs/hooks/useState/)

### Function Signatures

```ts
// Or another renderer, see Guides
type Renderer = (element: Element) => TemplateResult;

interface Options {
  baseElement: HTMLElement;
  observedAttributes: string[];
  useShadowDOM: boolean
}

declare function component(
  renderer: Renderer,
  options: Options
): Element;

declare function component<BaseElement = HTMLElement>(
  renderer: Renderer,
  baseElement: BaseElement,
  options: Options
): Element

declare function virtual(renderer: Renderer): Directive

```

## License

BSD-2-Clause
