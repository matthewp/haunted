import { component, html, createContext, useContext, useState, useProvideContext } from '../src/haunted.js';
import { fixture, expect, nextFrame } from '@open-wc/testing';

describe('context', function() {
  const defaultValue = 'halloween';
  const Context = createContext(defaultValue);

  const contexts = new WeakMap();
  function Consumer(element) {
    const context = useContext(Context);

    contexts.set(element, context);

    return html`${context}`;
  }

  customElements.define('context-consumer', component(Consumer));

  customElements.define('context-provider', Context.Provider as CustomElementConstructor);

  // Cast to unknown frst to deal with issue of Type 'Element &
  // ConsumerProps<string>' is missing properties from type 'HTMLElement'
  customElements.define('generic-consumer', Context.Consumer as unknown as CustomElementConstructor);

  function ProviderWithSlots() {
    const [slotProviderValue] = useState('slotted');

    return html`
      <context-provider .value=${slotProviderValue}>
        <slot></slot>
      </context-provider>
    `;
  }

  customElements.define(
    'slotted-context-provider',
    component(ProviderWithSlots)
  );

  function CustomProvider(host) {
    const {value} = host;
    useProvideContext(Context, value, [value]);
  }

  customElements.define('custom-provider', component(CustomProvider));

  let withProviderValue, withProviderUpdate;
  let rootProviderValue, rootProviderUpdate;
  let nestedProviderValue, nestedProviderUpdate;
  let genericConsumerValue, genericConsumerUpdate;
  let customProviderValue, customProviderUpdate;

  function Tests() {
    [withProviderValue, withProviderUpdate] = useState();
    [rootProviderValue, rootProviderUpdate] = useState('root');
    [nestedProviderValue, nestedProviderUpdate] = useState('nested');
    [genericConsumerValue, genericConsumerUpdate] = useState('generic');
    [customProviderValue, customProviderUpdate] = useState('custom');

    return html`
      <div id="without-provider">
        <context-consumer></context-consumer>
      </div>

      <div id="with-provider">
        <context-provider .value=${withProviderValue}>
          <context-consumer></context-consumer>
        </context-provider>
      </div>

      <div id="nested-providers">
        <context-provider .value=${rootProviderValue}>
          <context-consumer></context-consumer>
          <context-provider .value=${nestedProviderValue}>
            <context-consumer></context-consumer>
          </context-provider>
        </context-provider>
      </div>

      <div id="generic-consumer">
        <context-provider .value=${genericConsumerValue}>
          <generic-consumer .render=${(value) => html`${value}-value`}></generic-consumer>
        </context-provider>
      </div>

      <div id="with-slotted-provider">
        <context-provider .value=${genericConsumerValue}>
          <slotted-context-provider>
            <context-consumer></context-consumer>
          </slotted-context-provider>
        </context-provider>
      </div>

      <div id="custom-provider">
        <custom-provider .value=${customProviderValue}>
          <context-consumer></context-consumer>
        </custom-provider>
      </div>
    `;
  }

  const testTag = 'context-tests';

  customElements.define(testTag, component(Tests));

  function getResults(selector: string) {
    return [...document.querySelector('context-tests').shadowRoot.querySelectorAll(selector)].map(consumer => contexts.get(consumer));
  }

  function getContentResults(selector: string) {
    return [...document.querySelector('context-tests').shadowRoot.querySelectorAll(selector)].map((consumer) => (consumer).shadowRoot.textContent);
  }

  beforeEach(async () => {
    await fixture(html`<context-tests></context-tests>`);
  });

  it('uses defaultValue when provider is not found', () => {
    expect(getResults('#without-provider context-consumer')[0]).to.equal(defaultValue);
  });

  it('uses providers value when provider is found', async () => {
    withProviderUpdate('spooky');
    await nextFrame();
    expect(getResults('#with-provider context-consumer')[0]).to.equal('spooky');
  });

  it('uses providers value when provider is found even if it is undefined', () => {
    expect(getResults('#with-provider context-consumer')[0]).to.be.undefined;
  });

  it('uses closest provider ancestor\'s value', () => {
    expect(getResults('#nested-providers context-consumer')).to.deep.equal(['root', 'nested']);
  });

  it('uses slotted value when slotted provider is found', async () => {
    expect(getResults('#with-slotted-provider slotted-context-provider context-consumer')[0]).to.equal('slotted');
  });

  it('uses custom value when custom provider is found', async () => {
    expect(getResults('#custom-provider context-consumer')[0]).to.equal('custom');
  });

  describe('with generic consumer component', function () {
    it('should render template with context value', async () => {
      expect(getContentResults('#generic-consumer generic-consumer')).to.deep.equal(['generic-value']);
    });
  });
});
