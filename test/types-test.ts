/*
 * This file is meant to test the typings defined in index.d.ts.
 * Currently these are not actually run, but if you open the file in an
 * IDE that supports TypeScript, then you can quickly make sure that the
 * postive tests have no errors and the negative tests have errors.
 */

import { component, 
         useCallback, 
         useEffect, 
         useState, 
         useReducer, 
         useMemo, 
         withHooks, 
         virtual,
         useContext, 
         createContext, 
         hook, 
         Hook,
         html, 
         render } from '../index.js';

class MyElement extends HTMLElement {}

// component() tests
// positive tests, should all pass
component(() => html``)
component(() => html``, MyElement)
const componentTest1 = component((el) => {
    console.log(el.foo);
    return html``
}, HTMLElement, { useShadowDOM: true});
customElements.define('test-element', componentTest1);
// negative tests, should all fail
component();
component('foo');
component(()=>html``, 'foo');
component(()=>html``, HTMLElement, 'foo');
const componentTest2 = component(()=>{}, HTMLElement, {
    useShadowDOM: true,
    foo: 'bar'
});
componentTest2 + 1;

// useCallback tests
// positive tests, should all pass
useCallback(() => {}, ['foo']); 
useCallback(() => {}, ['foo', 2]); 
const useCallbackTest1 = useCallback(() => {}, ['foo', 2]); 
useCallbackTest1();
// negative tests, should all fail
useCallback();
useCallback('foo');
useCallback(() => {});
const useCallbackTest2 = useCallback(() => {}, 'foo');
useCallbackTest2 + 1;

// useEffect tests
// positive tests, should all pass
useEffect(() => {});
useEffect(() => {
    return () => {}
});
// negative tests, should all fail
useEffect();
useEffect('foo');
const useEffectTest1 = useEffect(() => {
    return 'foo';
})
useEffectTest1 + 1;

// useState tests
// positive tests, should all pass
useState();
useState('foo');
const [state, setState] = useState('foo');
setState(1);
// negative tests, should all fail
useState(1, 1);
const [state2, setState2] = useState(); setState2 + 1;

// useReducer tests
// positive tests, should all pass
useReducer(() => {}, 1)
// negactive tests, should all fail
useReducer();
const useReducerTest1 = useReducer(() => {});
useReducerTest1 + 1;

// useMemo tests
// positive tests, should all pass
useMemo(() => {}, []);
useMemo(() => {}, [1]);
// negactive tests, should all fail
useMemo();
useMemo(1, 1);
useMemo(() => {}, 1);

// withHooks tests
// positive tests, should all pass
const withHooksTest = withHooks(() => {})
withHooksTest();
const virtualTest = virtual(() => {});
virtualTest();
// negactive tests, should all fail
withHooks();
virtual();

// createContext
// positive tests, should all pass
const ThemeContext = createContext('dark');
ThemeContext.Consumer;
ThemeContext.Provider;
ThemeContext.defaultValue;
useContext(ThemeContext);

// hook
// positive tests, should all pass
const hookTest = hook(Hook);
hookTest();
hook(class extends Hook {});
// negative tests, should all fail
hook();
hook(3);


// html
// positive tests, should all pass
html``;
// negative tests, should all fail
html + 1;
html();

// render
// positive tests, should all pass
render(html``, document.createElement('div'));

