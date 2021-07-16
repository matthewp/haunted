# Guides >> Getting Started || 00

A starter app is available on [codesandbox](https://codesandbox.io/s/github/matthewp/haunted-starter-app/tree/master/) and also can be cloned from [this repo](https://github.com/matthewp/haunted-starter-app). This app gives you the basics of how to use Haunted and build components.

## Use

<code-tabs collection="package-managers" default-tab="npm" align="end">

```shell tab npm
npm install haunted
```

```shell tab yarn
yarn add haunted
```

```shell tab pnpm
pnpm add haunted
```

</code-tabs>

For Internet Explorer 11, you'll need to use a proxy polyfill to use Haunted, in addition to the usual webcomponentsjs polyfills.

```html
<script src="https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js"></script>
```

Here is a [full example of a web app that uses Haunted built for Internet Explorer 11](https://github.com/crisward/haunted-ie11). You can also use Custom Elements without the Shadow DOM if you need to:

```js
component(MyComponent, { useShadowDOM: false }));
```

## Importing

**Haunted** can be imported just like any other library when using a bundler of your choice:

```js
import {
  html,
  component,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useController,
  useContext
} from 'haunted';
```

The main entry point is intended for [lit-html](https://github.com/Polymer/lit-html) users.

## Web modules

**Haunted** can work directly in the browser without using any build tools. Simply import the `haunted.js` bundle. You can use the [unpkg](https://unpkg.com/) or [pika](https://www.pika.dev/cdn) CDNs. This works great for demo pages and small apps. Here's an example with unpkg:

```js
import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component, useState } from 'https://unpkg.com/haunted/haunted.js';
```

If using pika then use the `html` export from Haunted, as pika bundles everything together:

```js
import { html, component, useState } from 'https://cdn.pika.dev/haunted';
```

If you install Haunted **locally** this build is located at `/node_modules/haunted/haunted.js`. And if you're using PikaPkg (@pika/web) then you'll import it from `/web_modules/haunted.js`.
