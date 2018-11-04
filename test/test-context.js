import { component, html, createContext, useContext, useState } from '../web.js';
import { attach, cycle } from './helpers.js';

describe('context', function() {
  const defaultValue = 'halloween';
  const Context = createContext(defaultValue);
  
  let contexts = new WeakMap();
  function Consumer(element) {
    const context = useContext(Context);
    
    contexts.set(element, context);
    
    return html`${context}`;
  }

  customElements.define('context-consumer', component(Consumer));

  customElements.define('context-provider', Context.Provider);

  customElements.define('generic-consumer', Context.Consumer);

  let withProviderValue, withProviderUpdate;
  let rootProviderValue, rootProviderUpdate;
  let nestedProviderValue, nestedProviderUpdate;
  let genericConsumerValue, genericConsumerUpdate;

  function Tests() {
    [withProviderValue, withProviderUpdate] = useState();
    [rootProviderValue, rootProviderUpdate] = useState('root');
    [nestedProviderValue, nestedProviderUpdate] = useState('nested');
    [genericConsumerValue, genericConsumerUpdate] = useState('generic');
    
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
    `;
  }

  const testTag = 'context-tests';

  customElements.define(testTag, component(Tests));
  
  function getResults(selector) {
    return [...host.querySelector('context-tests').shadowRoot.querySelectorAll(selector)].map(consumer => contexts.get(consumer));
  }

  function getContentResults(selector) {
    return [...host.querySelector('context-tests').shadowRoot.querySelectorAll(selector)].map(consumer => consumer.shadowRoot.textContent);
  }

  let teardown;
  beforeEach(async () => {
    teardown = attach(testTag);
    await cycle();
  });

  afterEach(() => {
    teardown();
  });

  it('uses defaultValue when provider is not found', () => {
    assert.equal(getResults('#without-provider context-consumer')[0], defaultValue);
  });

  it('uses providers value when provider is found', async () => {
    withProviderUpdate('spooky');
    await cycle();
    assert.equal(getResults('#with-provider context-consumer')[0], 'spooky');
  });

  it('uses providers value when provider is found even if it is undefined', () => {
    assert.equal(getResults('#with-provider context-consumer')[0], undefined);
  });

  it('uses closest provider ancestor\'s value', () => {
    assert.deepEqual(getResults('#nested-providers context-consumer'), ['root', 'nested']);
  });

  describe('with generic consumer component', function () {
    it('should render template with context value', async () => {
      await cycle();
      assert.deepEqual(getContentResults('#generic-consumer generic-consumer'), ['generic-value']);
    });
  });
});