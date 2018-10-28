import { current } from './interface.js';
import { makeState, setState } from './use-state.js';

function makeUpdateState(element, map, id, reducer) {
  const updater = function(action) {
    const currentValue = map.get(id)[0];
    const newValue = reducer(currentValue, action);
    setState(map, id, [newValue, updater]);
    element._update();
  };
  return updater;
}

function initiateState(map, id, [reducer, initial]) {
  const updater = makeUpdateState(current, map, id, reducer);
  return [initial, updater];
}

export const useReducer = makeState.bind(null, initiateState);