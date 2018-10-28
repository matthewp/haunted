import { current, notify } from './interface.js';
import { stateSymbol } from './symbols.js';

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

export { setState, makeState, useState };