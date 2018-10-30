import { current, notify } from './interface.js';
import { memoValuesSymbol } from './symbols.js';
import { setState, stateMap } from './use-state.js';

function resolve(id, fn, values) {
  let valuesMap = current[memoValuesSymbol]
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

export { useMemo };