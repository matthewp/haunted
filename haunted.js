import { render } from 'https://unpkg.com/lit-html/lit-html.js';

const phaseSymbol = Symbol.for('haunted.phase');
const stateSymbol = Symbol.for('haunted.state');
const memoValuesSymbol = Symbol.for('haunted.memoValues');

const updateSymbol = Symbol.for('haunted.update');
const commitSymbol = Symbol.for('haunted.commit');

let current;
let currentId = 0;

function setCurrent(element) {
  current = element;
}

function clear() {
  current = null;
  currentId = 0;
}

function notify() {
  let id = currentId;
  currentId++;
  return id;
}

function scheduler() {
  let tasks = [];
  let id;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];
    for(var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function(task) {
    tasks.push(task);
    if(id == null) {
      id = requestAnimationFrame(runTasks);
    }
  };
}

const read = scheduler();
const write = scheduler();

function component(renderer, BaseElement = HTMLElement) {
  class Element extends BaseElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      
      this[phaseSymbol] = null;
      this[stateSymbol] = new Map();
      this._updateQueued = false;
    }

    connectedCallback() {
      this._update();
    }

    _update() {
      if(this._updateQueued) return;
      read(() => {
        let result = this._handlePhase(updateSymbol);
        write(() => {
          this._handlePhase(commitSymbol, result);
        });
        this._updateQueued = false;
      });
      this._updateQueued = true;
    }

    _handlePhase(phase, arg) {
      this[phaseSymbol] = phase;
      switch(phase) {
        case commitSymbol: return this._commit(arg);
        case updateSymbol: return this._render();
      }
      this[phaseSymbol] = null;
    }

    _commit(result) {
      render(result, this.shadowRoot);
      let effects = this[commitSymbol];
      if(effects) {
        for(let [,effect] of effects) {
          effect.call(this);
        }
      }
    }

    _render() {
      setCurrent(this);
      let result = renderer(this);
      clear();
      return result;
    }
  }
  function reflectiveProp(initialValue) {
    let value = initialValue;
    return Object.freeze({
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        this._update();
      }
    })
  }

  const proto = new Proxy(BaseElement.prototype, {
    set(target, key, value, receiver) {
      if(key in target) {
        Reflect.set(target, key, value);
      }
      let desc;
      if(typeof key === 'symbol' || key[0] === '_') {
        desc = {
          enumerable: true,
          configurable: true,
          writable: true,
          value
        }; 
      } else {
        desc = reflectiveProp(value);
      }
      Object.defineProperty(receiver, key, desc);

      return true;
    }
  });

  Object.setPrototypeOf(Element.prototype, proto);


  return Element;
}

function useEffect(callback) {
  let id = notify();
  if(!(commitSymbol in current)) {
    current[commitSymbol] = new Map();
  }
  current[commitSymbol].set(id, callback);
}

function stateMap(element) {
  return element[stateSymbol];
}

function makeUpdateState(element, map, id) {
  const updater = function(value) {
    setState(map, id, [value, updater]);
    element._update();
  };
  return updater;
}

function setState(map, id, value) {
  map.set(id, Object.freeze(value));
}

function makeState(setup, ...args) {
  let id = notify();
  let map = stateMap(current);
  if(!map.has(id)) {
    const initialValue = setup(map, id, args);
    setState(map, id, initialValue);
  }
  return map.get(id);
}

function initiateState(map, id, args) {
  const updater = makeUpdateState(current, map, id);
  return [args[0], updater];
}

const useState = makeState.bind(null, initiateState);

function makeUpdateState$1(element, map, id, reducer) {
  const updater = function(action) {
    const currentValue = map.get(id)[0];
    const newValue = reducer(currentValue, action);
    setState(map, id, [newValue, updater]);
    element._update();
  };
  return updater;
}

function initiateState$1(map, id, [reducer, initial]) {
  const updater = makeUpdateState$1(current, map, id, reducer);
  return [initial, updater];
}

const useReducer = makeState.bind(null, initiateState$1);

function resolve(id, fn, values) {
  let valuesMap = current[memoValuesSymbol];
  const lastValues = valuesMap.get(id);
  let changed = values.some((value, i) => lastValues[i] !== value);
  if(changed) {
    valuesMap.set(id, values);
    setState(stateMap(current), id, fn());
  }
}

function useMemo(fn, values) {
  let id = notify();
  let map = stateMap(current);
  if(!map.has(id)) {
    const initialValue = fn();
    if(!current[memoValuesSymbol]) {
      let valuesMap = current[memoValuesSymbol] = new Map();
      valuesMap.set(id, values);
    }
    setState(map, id, initialValue);
  } else {
    resolve(id, fn, values);
  }
  return map.get(id);
}

export { component, useEffect, useState, useReducer, useMemo };
